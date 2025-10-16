import answersData from "@/services/mockData/answers.json";
import notificationService from "@/services/api/notificationService";
import { questionService } from "@/services/api/questionService";

export const answerService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return answersData.map(answer => ({
      ...answer,
      id: answer.Id.toString()
    }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const answer = answersData.find(a => a.Id === parseInt(id));
    if (!answer) {
      throw new Error("Answer not found");
    }
    return {
      ...answer,
      id: answer.Id.toString()
    };
  },

  async getByQuestionId(questionId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return answersData
      .filter(answer => answer.questionId === questionId)
      .map(answer => ({
        ...answer,
        id: answer.Id.toString()
      }));
  },

async create(answerData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...answersData.map(a => a.Id)) + 1;
    const newAnswer = {
      Id: newId,
      id: newId.toString(),
      ...answerData,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    answersData.push({
      Id: newId,
      ...answerData,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Create notification for question author
    try {
      const question = await questionService.getById(answerData.questionId);
      if (question && question.userId !== answerData.userId) {
        await notificationService.create({
          userId: question.userId,
          questionId: answerData.questionId,
          answerId: newId,
          message: `New answer posted on your question`,
          type: 'answer'
        });
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
    
    return newAnswer;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = answersData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Answer not found");
    }
    
    answersData[index] = {
      ...answersData[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      ...answersData[index],
      id: answersData[index].Id.toString()
    };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = answersData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Answer not found");
    }
    
    answersData.splice(index, 1);
    return { success: true };
  }
};