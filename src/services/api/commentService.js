import commentsData from "@/services/mockData/comments.json";

export const commentService = {
  async getByTargetId(targetType, targetId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return commentsData
      .filter(comment => comment.targetType === targetType && comment.targetId === targetId)
      .map(comment => ({
        ...comment,
        id: comment.Id.toString()
      }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  async create(commentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = commentsData.length > 0 ? Math.max(...commentsData.map(c => c.Id)) + 1 : 1;
    const newComment = {
      Id: newId,
      id: newId.toString(),
      ...commentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    commentsData.push({
      Id: newId,
      ...commentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return newComment;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = commentsData.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    const comment = commentsData[index];
    const childComments = commentsData.filter(c => c.parentId === comment.Id);
    
    if (childComments.length > 0) {
      childComments.forEach(child => {
        const childIndex = commentsData.findIndex(c => c.Id === child.Id);
        if (childIndex !== -1) {
          commentsData.splice(childIndex, 1);
        }
      });
    }
    
    commentsData.splice(index, 1);
    return { success: true };
  }
};