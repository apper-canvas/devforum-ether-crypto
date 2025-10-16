import usersData from "@/services/mockData/users.json";

export const userService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return usersData.map(user => ({
      ...user,
      id: user.Id
    }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = usersData.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      ...user,
      id: user.Id
    };
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = `user${Math.max(...usersData.map(u => parseInt(u.Id.replace('user', '')))) + 1}`;
    const newUser = {
      Id: newId,
      id: newId,
      ...userData,
      reputation: 1,
      questionsAsked: 0,
      answersGiven: 0,
      joinedDate: new Date().toISOString()
    };
    
    usersData.push({
      Id: newId,
      ...userData,
      reputation: 1,
      questionsAsked: 0,
      answersGiven: 0,
      joinedDate: new Date().toISOString()
    });
    
    return newUser;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = usersData.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    
    usersData[index] = {
      ...usersData[index],
      ...updateData
    };
    
    return {
      ...usersData[index],
      id: usersData[index].Id
    };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = usersData.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    
    usersData.splice(index, 1);
    return { success: true };
  }
};