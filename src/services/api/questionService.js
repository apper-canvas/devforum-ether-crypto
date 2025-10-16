import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const questionService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('question_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "answer_count_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "accepted_answer_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(q => ({
        Id: q.Id,
        id: q.Id.toString(),
        title: q.title_c || '',
        body: q.body_c || '',
        tags: q.tags_c ? q.tags_c.split(',') : [],
        authorId: q.author_id_c?.Id || q.author_id_c || '',
        authorName: q.author_name_c || 'Unknown',
        authorReputation: q.author_reputation_c || 0,
        votes: q.votes_c || 0,
        views: q.views_c || 0,
        answerCount: q.answer_count_c || 0,
        acceptedAnswerId: q.accepted_answer_id_c?.Id || q.accepted_answer_id_c || null,
        createdAt: q.CreatedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error fetching questions:", error?.response?.data?.message || error)
      toast.error("Failed to load questions")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('question_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "answer_count_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "accepted_answer_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Question not found")
      }

      const q = response.data
      return {
        Id: q.Id,
        id: q.Id.toString(),
        title: q.title_c || '',
        body: q.body_c || '',
        tags: q.tags_c ? q.tags_c.split(',') : [],
        authorId: q.author_id_c?.Id || q.author_id_c || '',
        authorName: q.author_name_c || 'Unknown',
        authorReputation: q.author_reputation_c || 0,
        votes: q.votes_c || 0,
        views: q.views_c || 0,
        answerCount: q.answer_count_c || 0,
        acceptedAnswerId: q.accepted_answer_id_c?.Id || q.accepted_answer_id_c || null,
        createdAt: q.CreatedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(questionData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Name: questionData.title || 'Untitled',
            title_c: questionData.title || '',
            body_c: questionData.body || '',
            tags_c: Array.isArray(questionData.tags) ? questionData.tags.join(',') : '',
            author_name_c: questionData.authorName || 'Unknown',
            author_reputation_c: questionData.authorReputation || 0,
            author_id_c: questionData.authorId ? parseInt(questionData.authorId) : null,
            votes_c: 0,
            views_c: 0,
            answer_count_c: 0
          }
        ]
      }

      const response = await apperClient.createRecord('question_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create question")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create question:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create question")
        }

        const created = response.results[0].data
        return {
          Id: created.Id,
          id: created.Id.toString(),
          title: created.title_c || '',
          body: created.body_c || '',
          tags: created.tags_c ? created.tags_c.split(',') : [],
          authorId: created.author_id_c?.Id || created.author_id_c || '',
          authorName: created.author_name_c || 'Unknown',
          authorReputation: created.author_reputation_c || 0,
          votes: 0,
          views: 0,
          answerCount: 0,
          acceptedAnswerId: null,
          createdAt: created.CreatedOn || new Date().toISOString()
        }
      }

      throw new Error("Failed to create question")
    } catch (error) {
      console.error("Error creating question:", error?.response?.data?.message || error)
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
            ...(updateData.title && { title_c: updateData.title }),
            ...(updateData.body && { body_c: updateData.body }),
            ...(updateData.tags && { tags_c: Array.isArray(updateData.tags) ? updateData.tags.join(',') : updateData.tags }),
            ...(updateData.votes !== undefined && { votes_c: updateData.votes }),
            ...(updateData.views !== undefined && { views_c: updateData.views }),
            ...(updateData.answerCount !== undefined && { answer_count_c: updateData.answerCount }),
            ...(updateData.acceptedAnswerId !== undefined && { accepted_answer_id_c: updateData.acceptedAnswerId })
          }
        ]
      }

      const response = await apperClient.updateRecord('question_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to update question")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update question:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to update question")
        }

        const updated = response.results[0].data
        return {
          Id: updated.Id,
          id: updated.Id.toString(),
          title: updated.title_c || '',
          body: updated.body_c || '',
          tags: updated.tags_c ? updated.tags_c.split(',') : [],
          authorId: updated.author_id_c?.Id || updated.author_id_c || '',
          authorName: updated.author_name_c || 'Unknown',
          authorReputation: updated.author_reputation_c || 0,
          votes: updated.votes_c || 0,
          views: updated.views_c || 0,
          answerCount: updated.answer_count_c || 0,
          acceptedAnswerId: updated.accepted_answer_id_c?.Id || updated.accepted_answer_id_c || null,
          createdAt: updated.CreatedOn || new Date().toISOString()
        }
      }

      throw new Error("Failed to update question")
    } catch (error) {
      console.error("Error updating question:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.deleteRecord('question_c', {
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
          console.error(`Failed to delete question:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return { success: false }
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting question:", error?.response?.data?.message || error)
return { success: false }
    }
  }
};