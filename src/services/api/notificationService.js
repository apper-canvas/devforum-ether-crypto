import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

const notificationService = {
  async getAll(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('notification_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "answer_id_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "user_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(userId)]
          }
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(n => ({
        Id: n.Id,
        userId: n.user_id_c?.Id || n.user_id_c || '',
        questionId: n.question_id_c?.Id || n.question_id_c || '',
        answerId: n.answer_id_c?.Id || n.answer_id_c || '',
        message: n.message_c || '',
        type: n.type_c || 'answer',
        read: n.read_c || false,
        createdAt: n.CreatedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error?.response?.data?.message || error)
      toast.error("Failed to load notifications")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('notification_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "answer_id_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      const n = response.data
      return {
        Id: n.Id,
        userId: n.user_id_c?.Id || n.user_id_c || '',
        questionId: n.question_id_c?.Id || n.question_id_c || '',
        answerId: n.answer_id_c?.Id || n.answer_id_c || '',
        message: n.message_c || '',
        type: n.type_c || 'answer',
        read: n.read_c || false,
        createdAt: n.CreatedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(notificationData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Name: `Notification for user ${notificationData.userId}`,
            user_id_c: notificationData.userId ? parseInt(notificationData.userId) : null,
            question_id_c: notificationData.questionId ? parseInt(notificationData.questionId) : null,
            answer_id_c: notificationData.answerId ? parseInt(notificationData.answerId) : null,
            message_c: notificationData.message || '',
            type_c: notificationData.type || 'answer',
            read_c: false
          }
        ]
      }

      const response = await apperClient.createRecord('notification_c', payload)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create notification:`, failed)
          return null
        }

        const created = response.results[0].data
        return {
          Id: created.Id,
          userId: created.user_id_c?.Id || created.user_id_c || '',
          questionId: created.question_id_c?.Id || created.question_id_c || '',
          answerId: created.answer_id_c?.Id || created.answer_id_c || '',
          message: created.message_c || '',
          type: created.type_c || 'answer',
          read: false,
          createdAt: created.CreatedOn || new Date().toISOString()
        }
      }

      return null
    } catch (error) {
      console.error("Error creating notification:", error?.response?.data?.message || error)
      return null
    }
  },

  async markAsRead(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Id: parseInt(id),
            read_c: true
          }
        ]
      }

      const response = await apperClient.updateRecord('notification_c', payload)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to mark notification as read:`, failed)
          return null
        }

        const updated = response.results[0].data
        return {
          Id: updated.Id,
          userId: updated.user_id_c?.Id || updated.user_id_c || '',
          questionId: updated.question_id_c?.Id || updated.question_id_c || '',
          answerId: updated.answer_id_c?.Id || updated.answer_id_c || '',
          message: updated.message_c || '',
          type: updated.type_c || 'answer',
          read: true,
          createdAt: updated.CreatedOn || new Date().toISOString()
        }
      }

      return null
    } catch (error) {
      console.error("Error marking notification as read:", error?.response?.data?.message || error)
      return null
    }
  },

  async markAllAsRead(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const fetchResponse = await apperClient.fetchRecords('notification_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "read_c"}}
        ],
        where: [
          {
            "FieldName": "user_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(userId)]
          },
          {
            "FieldName": "read_c",
            "Operator": "EqualTo",
            "Values": [false]
          }
        ]
      })

      if (!fetchResponse.success || !fetchResponse.data || fetchResponse.data.length === 0) {
        return 0
      }

      const records = fetchResponse.data.map(n => ({
        Id: n.Id,
        read_c: true
      }))

      const updateResponse = await apperClient.updateRecord('notification_c', {
        records: records
      })

      if (!updateResponse.success) {
        console.error(updateResponse.message)
        return 0
      }

      const successful = updateResponse.results?.filter(r => r.success).length || 0
      return successful
    } catch (error) {
      console.error(`Error marking all notifications as read for user ${userId}:`, error?.response?.data?.message || error)
      return 0
    }
  },

  async getUnreadCount(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('notification_c', {
        fields: [{"field": {"Name": "Name"}}],
        where: [
          {
            "FieldName": "user_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(userId)]
          },
          {
            "FieldName": "read_c",
            "Operator": "EqualTo",
            "Values": [false]
          }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return 0
      }

      return response.data?.length || 0
    } catch (error) {
      console.error(`Error getting unread count for user ${userId}:`, error?.response?.data?.message || error)
      return 0
    }
  }
}

export default notificationService