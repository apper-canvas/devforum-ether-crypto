import notificationsData from "@/services/mockData/notifications.json";

/**
 * Notification Service
 * Handles notification operations with mock data storage
 * Migration path: Replace with ApperClient when notification table available
 */
const notificationService = {
  /**
   * Get all notifications for a user
   * @param {number} userId - User ID to get notifications for
   * @returns {Promise<Array>} Array of notification objects
   */
  async getAll(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return notificationsData
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(n => ({ ...n }));
  },

  /**
   * Get notification by ID
   * @param {number} id - Notification ID
   * @returns {Promise<Object|null>} Notification object or null
   */
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = notificationsData.find(n => n.Id === id);
    return notification ? { ...notification } : null;
  },

  /**
   * Create new notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async create(notificationData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = notificationsData.length > 0 
      ? Math.max(...notificationsData.map(n => n.Id)) + 1 
      : 1;
    
    const newNotification = {
      Id: newId,
      userId: notificationData.userId,
      questionId: notificationData.questionId,
      answerId: notificationData.answerId,
      message: notificationData.message,
      type: notificationData.type || 'answer',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notificationsData.push(newNotification);
    return { ...newNotification };
  },

  /**
   * Mark notification as read
   * @param {number} id - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = notificationsData.find(n => n.Id === id);
    if (notification) {
      notification.read = true;
      return { ...notification };
    }
    return null;
  },

  /**
   * Mark all notifications as read for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Number of notifications marked as read
   */
  async markAllAsRead(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    let count = 0;
    notificationsData.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        count++;
      }
    });
    return count;
  },

  /**
   * Get unread notification count for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Unread notification count
   */
  async getUnreadCount(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return notificationsData.filter(n => n.userId === userId && !n.read).length;
  }
};

export default notificationService;