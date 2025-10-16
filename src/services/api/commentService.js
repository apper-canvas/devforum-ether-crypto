import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

export const commentService = {
  async getByTargetId(targetType, targetId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('comment_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "target_type_c"}},
          {"field": {"Name": "target_id_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "target_type_c",
            "Operator": "EqualTo",
            "Values": [targetType]
          },
          {
            "FieldName": "target_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(targetId)]
          }
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(c => ({
        Id: c.Id,
        id: c.Id.toString(),
        targetType: c.target_type_c || '',
        targetId: c.target_id_c?.toString() || '',
        authorId: c.author_id_c?.Id || c.author_id_c || '',
        content: c.content_c || '',
        parentId: c.parent_id_c || null,
        createdAt: c.CreatedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error(`Error fetching comments for ${targetType} ${targetId}:`, error?.response?.data?.message || error)
      toast.error("Failed to load comments")
      return []
    }
  },

  async create(commentData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Name: `Comment by ${commentData.authorId}`,
            target_type_c: commentData.targetType || '',
            target_id_c: commentData.targetId ? parseInt(commentData.targetId) : null,
            author_id_c: commentData.authorId ? parseInt(commentData.authorId) : null,
            content_c: commentData.content || '',
            parent_id_c: commentData.parentId ? parseInt(commentData.parentId) : null
          }
        ]
      }

      const response = await apperClient.createRecord('comment_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create comment")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create comment:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create comment")
        }

        const created = response.results[0].data
        return {
          Id: created.Id,
          id: created.Id.toString(),
          targetType: created.target_type_c || '',
          targetId: created.target_id_c?.toString() || '',
          authorId: created.author_id_c?.Id || created.author_id_c || '',
          content: created.content_c || '',
          parentId: created.parent_id_c || null,
          createdAt: created.CreatedOn || new Date().toISOString()
        }
      }

      throw new Error("Failed to create comment")
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const allComments = await apperClient.fetchRecords('comment_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "parent_id_c"}}
        ]
      })

      const childIds = []
      if (allComments.success && allComments.data) {
        allComments.data.forEach(c => {
          if (c.parent_id_c === parseInt(id)) {
            childIds.push(c.Id)
          }
        })
      }

      const idsToDelete = [parseInt(id), ...childIds]

      const response = await apperClient.deleteRecord('comment_c', {
        RecordIds: idsToDelete
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false }
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete comments:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return { success: false }
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error)
      return { success: false }
    }
  }
}