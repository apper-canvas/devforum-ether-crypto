import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

export const userService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('user_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "reputation_c"}},
          {"field": {"Name": "questions_asked_c"}},
          {"field": {"Name": "answers_given_c"}},
          {"field": {"Name": "joined_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(u => ({
        Id: u.Id,
        id: u.Id,
        name: u.name_c || u.Name || 'Unknown',
        reputation: u.reputation_c || 0,
        questionsAsked: u.questions_asked_c || 0,
        answersGiven: u.answers_given_c || 0,
        joinedDate: u.joined_date_c || u.CreatedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error)
      toast.error("Failed to load users")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('user_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "reputation_c"}},
          {"field": {"Name": "questions_asked_c"}},
          {"field": {"Name": "answers_given_c"}},
          {"field": {"Name": "joined_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("User not found")
      }

      const u = response.data
      return {
        Id: u.Id,
        id: u.Id,
        name: u.name_c || u.Name || 'Unknown',
        reputation: u.reputation_c || 0,
        questionsAsked: u.questions_asked_c || 0,
        answersGiven: u.answers_given_c || 0,
        joinedDate: u.joined_date_c || u.CreatedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(userData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Name: userData.name || 'User',
            name_c: userData.name || '',
            reputation_c: 1,
            questions_asked_c: 0,
            answers_given_c: 0,
            joined_date_c: new Date().toISOString()
          }
        ]
      }

      const response = await apperClient.createRecord('user_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create user")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create user:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create user")
        }

        const created = response.results[0].data
        return {
          Id: created.Id,
          id: created.Id,
          name: created.name_c || created.Name || 'Unknown',
          reputation: 1,
          questionsAsked: 0,
          answersGiven: 0,
          joinedDate: created.joined_date_c || created.CreatedOn || new Date().toISOString()
        }
      }

      throw new Error("Failed to create user")
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error)
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
            ...(updateData.name && { name_c: updateData.name }),
            ...(updateData.reputation !== undefined && { reputation_c: updateData.reputation }),
            ...(updateData.questionsAsked !== undefined && { questions_asked_c: updateData.questionsAsked }),
            ...(updateData.answersGiven !== undefined && { answers_given_c: updateData.answersGiven })
          }
        ]
      }

      const response = await apperClient.updateRecord('user_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to update user")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update user:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to update user")
        }

        const updated = response.results[0].data
        return {
          Id: updated.Id,
          id: updated.Id,
          name: updated.name_c || updated.Name || 'Unknown',
          reputation: updated.reputation_c || 0,
          questionsAsked: updated.questions_asked_c || 0,
          answersGiven: updated.answers_given_c || 0,
          joinedDate: updated.joined_date_c || updated.CreatedOn || new Date().toISOString()
        }
      }

      throw new Error("Failed to update user")
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.deleteRecord('user_c', {
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
          console.error(`Failed to delete user:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return { success: false }
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error)
      return { success: false }
    }
  }
}