import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import VoteControls from "@/components/molecules/VoteControls";
import UserBadge from "@/components/molecules/UserBadge";
import Tag from "@/components/atoms/Tag";
import { parseMarkdown } from "@/utils/markdown";

const QuestionCard = ({ question, onVote }) => {
  const excerpt = question.body.length > 200 
    ? question.body.substring(0, 200) + "..." 
    : question.body;

  return (
    <div className="bg-surface border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex gap-4">
        {/* Vote Controls */}
        <VoteControls
          votes={question.votes}
          targetId={question.id}
          targetType="question"
          onVote={onVote}
          className="flex-shrink-0"
        />

        {/* Stats */}
        <div className="flex flex-col items-center space-y-1 min-w-[60px] flex-shrink-0">
          <div className="flex items-center gap-1 text-gray-600">
            <ApperIcon name="MessageSquare" className="w-4 h-4" />
            <span className="font-semibold">{question.answerCount}</span>
          </div>
          <span className="text-xs text-gray-500">answers</span>
          
          <div className="flex items-center gap-1 text-gray-600 mt-2">
            <ApperIcon name="Eye" className="w-4 h-4" />
            <span className="text-sm">{question.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <Link 
              to={`/question/${question.id}`}
              className="text-primary hover:text-primary/80 font-semibold text-lg leading-tight block mb-2"
            >
              {question.title}
            </Link>
            {question.acceptedAnswerId && (
              <div className="flex items-center gap-1 text-success ml-4 flex-shrink-0">
                <ApperIcon name="CheckCircle" className="w-5 h-5" />
                <span className="text-sm font-medium">Answered</span>
              </div>
            )}
          </div>
          
          <div 
            className="text-gray-700 text-sm leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(excerpt) }}
          />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map((tag) => (
              <Tag key={tag} variant="primary">
                {tag}
              </Tag>
            ))}
          </div>
          
          {/* Author and Date */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              asked {question.createdAt}
            </div>
            <UserBadge 
              user={{
                id: question.authorId,
                name: question.authorName,
                reputation: question.authorReputation
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;