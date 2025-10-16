import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import UserBadge from "@/components/molecules/UserBadge";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import { parseMarkdown } from "@/utils/markdown";
import { commentService } from "@/services/api/commentService";
import { userService } from "@/services/api/userService";
import { toast } from "react-toastify";

function CommentThread({ targetType, targetId }) {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [collapsedThreads, setCollapsedThreads] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [targetType, targetId]);

  async function loadComments() {
    try {
      setLoading(true);
      setError(null);
      
      const [commentsData, usersData] = await Promise.all([
        commentService.getByTargetId(targetType, targetId),
        userService.getAll()
      ]);
      
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.Id] = user;
      });
      
      setComments(commentsData);
      setUsers(usersMap);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment() {
    if (!newCommentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      const newComment = await commentService.create({
        targetType,
        targetId,
        authorId: "user1",
        content: newCommentContent,
        parentId: null
      });
      
      setComments(prev => [...prev, newComment]);
      setNewCommentContent("");
      toast.success("Comment added successfully");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddReply(parentId) {
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      const newReply = await commentService.create({
        targetType,
        targetId,
        authorId: "user1",
        content: replyContent,
        parentId: parseInt(parentId)
      });
      
      setComments(prev => [...prev, newReply]);
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Reply added successfully");
    } catch (err) {
      toast.error("Failed to add reply");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment? All replies will also be deleted.")) {
      return;
    }

    try {
      await commentService.delete(commentId);
      setComments(prev => prev.filter(c => 
        c.Id !== parseInt(commentId) && c.parentId !== parseInt(commentId)
      ));
      toast.success("Comment deleted successfully");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  }

  function toggleThread(commentId) {
    setCollapsedThreads(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  }

  function getReplies(parentId) {
    return comments.filter(c => c.parentId === parentId);
  }

  function renderComment(comment, level = 0) {
    const author = users[comment.authorId];
    const replies = getReplies(comment.Id);
    const isCollapsed = collapsedThreads[comment.Id];
    const hasReplies = replies.length > 0;

    return (
      <div key={comment.Id} className={level > 0 ? "ml-8 mt-3" : "mt-3"}>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <UserBadge
                user={author}
                timestamp={comment.createdAt}
                showReputation={false}
                size="sm"
              />
              <div className="flex items-center gap-2">
                {hasReplies && (
                  <button
                    onClick={() => toggleThread(comment.Id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={isCollapsed ? "Expand thread" : "Collapse thread"}
                  >
                    <ApperIcon 
                      name={isCollapsed ? "ChevronRight" : "ChevronDown"} 
                      size={16} 
                    />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-400 hover:text-error transition-colors"
                  aria-label="Delete comment"
                >
                  <ApperIcon name="Trash2" size={14} />
                </button>
              </div>
            </div>
            
            <div 
              className="mt-2 text-sm text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(comment.content) }}
            />
            
            {!isCollapsed && (
              <>
                <div className="mt-2">
                  <button
                    onClick={() => setReplyingTo(comment.Id)}
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <ApperIcon name="MessageSquare" size={14} />
                    Reply
                  </button>
                </div>

                {replyingTo === comment.Id && (
                  <div className="mt-3 space-y-2">
                    <TextArea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      rows={2}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddReply(comment.Id)}
                        disabled={submitting || !replyContent.trim()}
                        size="sm"
                      >
                        {submitting ? "Posting..." : "Post Reply"}
                      </Button>
                      <Button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {hasReplies && (
                  <div className="border-l-2 border-gray-200 pl-4 mt-3">
                    {replies.map(reply => renderComment(reply, level + 1))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <ApperIcon name="Loader" size={16} className="animate-spin" />
          <span className="text-sm">Loading comments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-error/10 rounded-lg">
        <p className="text-sm text-error">Error loading comments: {error}</p>
      </div>
    );
  }

  const topLevelComments = comments.filter(c => c.parentId === null);

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="MessageSquare" size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {topLevelComments.map(comment => renderComment(comment))}
      </div>

      <div className="space-y-3">
        <TextArea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full"
        />
        <Button
          onClick={handleAddComment}
          disabled={submitting || !newCommentContent.trim()}
        >
          {submitting ? "Posting..." : "Add Comment"}
        </Button>
      </div>
    </div>
  );
}

export default CommentThread;