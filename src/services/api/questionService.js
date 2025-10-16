import questionsData from "@/services/mockData/questions.json";

export const questionService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return questionsData.map(question => ({
      ...question,
      id: question.Id.toString()
    }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const question = questionsData.find(q => q.Id === parseInt(id));
    if (!question) {
      throw new Error("Question not found");
    }
    return {
      ...question,
      id: question.Id.toString()
    };
  },

  async create(questionData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...questionsData.map(q => q.Id)) + 1;
    const newQuestion = {
      Id: newId,
      id: newId.toString(),
      ...questionData,
      votes: 0,
      views: 0,
      answerCount: 0,
      acceptedAnswerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    questionsData.push({
      Id: newId,
      ...questionData,
      votes: 0,
      views: 0,
      answerCount: 0,
      acceptedAnswerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return newQuestion;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = questionsData.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Question not found");
    }
    
    questionsData[index] = {
      ...questionsData[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      ...questionsData[index],
      id: questionsData[index].Id.toString()
    };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = questionsData.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Question not found");
    }
    
    questionsData.splice(index, 1);
    return { success: true };
  }
};