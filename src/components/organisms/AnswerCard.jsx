import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import VoteControls from "@/components/molecules/VoteControls";
import UserBadge from "@/components/molecules/UserBadge";
import CommentThread from "@/components/organisms/CommentThread";
import Button from "@/components/atoms/Button";
import { parseMarkdown } from "@/utils/markdown";
import { cn } from "@/utils/cn";

const AnswerCard = ({ answer, canAccept = false, onVote, onAccept }) => {
  const [isAccepted, setIsAccepted] = useState(answer.isAccepted);

  const handleAccept = () => {
    setIsAccepted(true);
    if (onAccept) {
      onAccept(answer.id);
    }
  };

  return (
    <div className={cn(
      "border rounded-lg p-6 transition-all duration-200",
      isAccepted 
        ? "bg-success/5 border-success/20 shadow-md" 
        : "bg-surface border-gray-200 hover:shadow-sm"
    )}>
      <div className="flex gap-4">
        {/* Vote Controls */}
        <VoteControls
          votes={answer.votes}
          targetId={answer.id}
          targetType="answer"
          onVote={onVote}
          className="flex-shrink-0"
        />

        {/* Accept Button */}
        {(canAccept && !isAccepted) ? (
          <button
            onClick={handleAccept}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-success hover:bg-success/10 rounded-full transition-all duration-200 transform hover:scale-110"
            title="Accept this answer"
          >
            <ApperIcon name="Check" className="w-6 h-6" />
          </button>
        ) : isAccepted ? (
          <div className="flex-shrink-0 p-2 text-success bg-success/10 rounded-full">
            <ApperIcon name="CheckCircle" className="w-6 h-6" />
          </div>
        ) : (
          <div className="w-10" />
        )}

        {/* Content */}
        <div className="flex-1">
          {isAccepted && (
            <div className="flex items-center gap-2 mb-3 text-success font-medium">
              <ApperIcon name="CheckCircle" className="w-5 h-5" />
              <span>Accepted Answer</span>
            </div>
          )}
          
          <div 
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(answer.body) }}
          />
          
          {/* Author and Date */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              answered {answer.createdAt}
            </div>
            <UserBadge 
              user={{
                id: answer.authorId,
                name: answer.authorName,
                reputation: answer.authorReputation
              }}
            />
</div>

          <CommentThread 
            targetType="answer" 
            targetId={answer.id} 
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;