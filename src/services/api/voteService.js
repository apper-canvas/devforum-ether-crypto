import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

export const voteService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('vote_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "target_id_c"}},
          {"field": {"Name": "target_type_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(v => ({
        Id: v.Id,
        id: v.Id.toString(),
        userId: v.user_id_c?.Id || v.user_id_c || '',
        targetId: v.target_id_c?.toString() || '',
        targetType: v.target_type_c || '',
        value: v.value_c || 0
      }))
    } catch (error) {
      console.error("Error fetching votes:", error?.response?.data?.message || error)
      toast.error("Failed to load votes")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('vote_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "target_id_c"}},
          {"field": {"Name": "target_type_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Vote not found")
      }

      const v = response.data
      return {
        Id: v.Id,
        id: v.Id.toString(),
        userId: v.user_id_c?.Id || v.user_id_c || '',
        targetId: v.target_id_c?.toString() || '',
        targetType: v.target_type_c || '',
        value: v.value_c || 0
      }
    } catch (error) {
      console.error(`Error fetching vote ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async getByUser(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('vote_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "target_id_c"}},
          {"field": {"Name": "target_type_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "user_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(userId)]
          }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(v => ({
        Id: v.Id,
        id: v.Id.toString(),
        userId: v.user_id_c?.Id || v.user_id_c || '',
        targetId: v.target_id_c?.toString() || '',
        targetType: v.target_type_c || '',
        value: v.value_c || 0
      }))
    } catch (error) {
      console.error(`Error fetching votes for user ${userId}:`, error?.response?.data?.message || error)
      toast.error("Failed to load user votes")
      return []
    }
  },

  async create(voteData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const payload = {
        records: [
          {
            Name: `Vote by ${voteData.userId}`,
            user_id_c: voteData.userId ? parseInt(voteData.userId) : null,
            target_id_c: voteData.targetId ? parseInt(voteData.targetId) : null,
            target_type_c: voteData.targetType || '',
            value_c: voteData.value || 0
          }
        ]
      }

      const response = await apperClient.createRecord('vote_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create vote")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create vote:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create vote")
        }

        const created = response.results[0].data
        return {
          Id: created.Id,
          id: created.Id.toString(),
          userId: created.user_id_c?.Id || created.user_id_c || '',
          targetId: created.target_id_c?.toString() || '',
          targetType: created.target_type_c || '',
          value: created.value_c || 0
        }
      }

      throw new Error("Failed to create vote")
    } catch (error) {
      console.error("Error creating vote:", error?.response?.data?.message || error)
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
            ...(updateData.value !== undefined && { value_c: updateData.value })
          }
        ]
      }

      const response = await apperClient.updateRecord('vote_c', payload)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to update vote")
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update vote:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to update vote")
        }

        const updated = response.results[0].data
        return {
          Id: updated.Id,
          id: updated.Id.toString(),
          userId: updated.user_id_c?.Id || updated.user_id_c || '',
          targetId: updated.target_id_c?.toString() || '',
          targetType: updated.target_type_c || '',
          value: updated.value_c || 0
        }
      }

      throw new Error("Failed to update vote")
    } catch (error) {
      console.error("Error updating vote:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.deleteRecord('vote_c', {
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
          console.error(`Failed to delete vote:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return { success: false }
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting vote:", error?.response?.data?.message || error)
      return { success: false }
    }
  }
}