import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"
import notificationService from "@/services/api/notificationService"
import { questionService } from "@/services/api/questionService"

export const answerService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('answer_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "is_accepted_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(a => ({
        Id: a.Id,
        id: a.Id.toString(),
        body: a.body_c || '',
        authorId: a.author_id_c?.Id || a.author_id_c || '',
        authorName: a.author_name_c || 'Unknown',
        authorReputation: a.author_reputation_c || 0,
        votes: a.votes_c || 0,
        isAccepted: a.is_accepted_c || false,
        questionId: a.question_id_c?.Id || a.question_id_c || '',
        createdAt: a.CreatedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error fetching answers:", error?.response?.data?.message || error)
      toast.error("Failed to load answers")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('answer_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "is_accepted_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Answer not found")
      }

      const a = response.data
      return {
        Id: a.Id,
        id: a.Id.toString(),
        body: a.body_c || '',
        authorId: a.author_id_c?.Id || a.author_id_c || '',
        authorName: a.author_name_c || 'Unknown',
        authorReputation: a.author_reputation_c || 0,
        votes: a.votes_c || 0,
        isAccepted: a.is_accepted_c || false,
        questionId: a.question_id_c?.Id || a.question_id_c || '',
        createdAt: a.CreatedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error fetching answer ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async getByQuestionId(questionId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('answer_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "is_accepted_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "question_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(questionId)]
          }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(a => ({
        Id: a.Id,
        id: a.Id.toString(),
        body: a.body_c || '',
        authorId: a.author_id_c?.Id || a.author_id_c || '',
        authorName: a.author_name_c || 'Unknown',
        authorReputation: a.author_reputation_c || 0,
        votes: a.votes_c || 0,
        isAccepted: a.is_accepted_c || false,
        questionId: a.question_id_c?.Id || a.question_id_c || '',
        createdAt: a.CreatedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error(`Error fetching answers for question ${questionId}:`, error?.response?.data?.message || error)
      toast.error("Failed to load answers")
      return []
    }
  },

  async create(answerData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Name: `Answer to question ${answerData.questionId}`,
            body_c: answerData.body || '',
            author_name_c: answerData.authorName || 'Unknown',
            author_reputation_c: answerData.authorReputation || 0,
            author_id_c: answerData.authorId ? parseInt(answerData.authorId) : null,
            question_id_c: parseInt(answerData.questionId),
            votes_c: 0,
            is_accepted_c: false
          }
        ]
      }

      const response = await apperClient.createRecord('answer_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create answer")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create answer:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create answer")
        }

        const created = response.results[0].data
        
        try {
          const question = await questionService.getById(answerData.questionId)
          if (question && question.authorId !== answerData.authorId) {
            await notificationService.create({
              userId: question.authorId,
              questionId: parseInt(answerData.questionId),
              answerId: created.Id,
              message: `New answer posted on your question`,
              type: 'answer'
            })
          }
        } catch (error) {
          console.error('Failed to create notification:', error)
        }

        return {
          Id: created.Id,
          id: created.Id.toString(),
          body: created.body_c || '',
          authorId: created.author_id_c?.Id || created.author_id_c || '',
          authorName: created.author_name_c || 'Unknown',
          authorReputation: created.author_reputation_c || 0,
          votes: 0,
          isAccepted: false,
          questionId: created.question_id_c?.Id || created.question_id_c || '',
          createdAt: created.CreatedOn || new Date().toISOString()
        }
      }

      throw new Error("Failed to create answer")
    } catch (error) {
      console.error("Error creating answer:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Id: parseInt(id),
            ...(updateData.body && { body_c: updateData.body }),
            ...(updateData.votes !== undefined && { votes_c: updateData.votes }),
            ...(updateData.isAccepted !== undefined && { is_accepted_c: updateData.isAccepted })
          }
        ]
      }

      const response = await apperClient.updateRecord('answer_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to update answer")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update answer:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to update answer")
        }

        const updated = response.results[0].data
        return {
          Id: updated.Id,
          id: updated.Id.toString(),
          body: updated.body_c || '',
          authorId: updated.author_id_c?.Id || updated.author_id_c || '',
          authorName: updated.author_name_c || 'Unknown',
          authorReputation: updated.author_reputation_c || 0,
          votes: updated.votes_c || 0,
          isAccepted: updated.is_accepted_c || false,
          questionId: updated.question_id_c?.Id || updated.question_id_c || '',
          createdAt: updated.CreatedOn || new Date().toISOString()
        }
      }

      throw new Error("Failed to update answer")
    } catch (error) {
      console.error("Error updating answer:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.deleteRecord('answer_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false }
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete answer:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return { success: false }
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting answer:", error?.response?.data?.message || error)
      return { success: false }
    }
  }
}