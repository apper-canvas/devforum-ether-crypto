import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";

const VoteControls = ({ votes, targetId, targetType, onVote, className }) => {
  const [userVote, setUserVote] = useState(null);
  const [currentVotes, setCurrentVotes] = useState(votes);

  const handleVote = (value) => {
    // If clicking the same vote, remove it
    const newVote = userVote === value ? null : value;
    
    // Calculate vote difference
    let voteDiff = 0;
    if (userVote === null && newVote !== null) {
      voteDiff = newVote;
    } else if (userVote !== null && newVote === null) {
      voteDiff = -userVote;
    } else if (userVote !== null && newVote !== null) {
      voteDiff = newVote - userVote;
    }
    
    setUserVote(newVote);
    setCurrentVotes(prev => prev + voteDiff);
    
    if (onVote) {
      onVote(targetId, newVote);
    }
    
    toast.success(newVote === 1 ? "Upvoted!" : newVote === -1 ? "Downvoted!" : "Vote removed");
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <button
        onClick={() => handleVote(1)}
        className={cn(
          "p-2 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95",
          userVote === 1
            ? "text-accent bg-accent/10"
            : "text-gray-400 hover:text-accent hover:bg-accent/5"
        )}
      >
        <ApperIcon name="ChevronUp" className="w-6 h-6" />
      </button>
      
      <span className={cn(
        "font-semibold text-lg min-w-[24px] text-center transition-all duration-300",
        currentVotes > 0 ? "text-success" : currentVotes < 0 ? "text-error" : "text-gray-600"
      )}>
        {currentVotes}
      </span>
      
      <button
        onClick={() => handleVote(-1)}
        className={cn(
          "p-2 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95",
          userVote === -1
            ? "text-error bg-error/10"
            : "text-gray-400 hover:text-error hover:bg-error/5"
        )}
      >
        <ApperIcon name="ChevronDown" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default VoteControls;