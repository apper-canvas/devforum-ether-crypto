import votesData from "@/services/mockData/votes.json";

export const voteService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return votesData.map(vote => ({
      ...vote,
      id: vote.Id.toString()
    }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const vote = votesData.find(v => v.Id === parseInt(id));
    if (!vote) {
      throw new Error("Vote not found");
    }
    return {
      ...vote,
      id: vote.Id.toString()
    };
  },

  async getByUser(userId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return votesData
      .filter(vote => vote.userId === userId)
      .map(vote => ({
        ...vote,
        id: vote.Id.toString()
      }));
  },

  async create(voteData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...votesData.map(v => v.Id)) + 1;
    const newVote = {
      Id: newId,
      id: newId.toString(),
      ...voteData
    };
    
    votesData.push({
      Id: newId,
      ...voteData
    });
    
    return newVote;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = votesData.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Vote not found");
    }
    
    votesData[index] = {
      ...votesData[index],
      ...updateData
    };
    
    return {
      ...votesData[index],
      id: votesData[index].Id.toString()
    };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = votesData.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Vote not found");
    }
    
    votesData.splice(index, 1);
    return { success: true };
  }
};