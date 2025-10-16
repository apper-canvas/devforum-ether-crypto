import { useState, useEffect } from "react";
import QuestionCard from "@/components/organisms/QuestionCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { questionService } from "@/services/api/questionService";

const QuestionList = ({ sortBy = "newest", tagFilter = null, searchTerm = null }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await questionService.getAll();
      
      let filteredQuestions = [...data];
      
      // Apply search filter
      if (searchTerm) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply tag filter
      if (tagFilter) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.tags.includes(tagFilter)
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case "votes":
          filteredQuestions.sort((a, b) => b.votes - a.votes);
          break;
        case "unanswered":
          filteredQuestions = filteredQuestions.filter(q => q.answerCount === 0);
          break;
        case "newest":
        default:
          filteredQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
      
      setQuestions(filteredQuestions);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [sortBy, tagFilter, searchTerm]);

  const handleVote = async (questionId, voteValue) => {
    // Update local state optimistically
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, votes: q.votes + (voteValue || 0) }
        : q
    ));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuestions} />;
  if (questions.length === 0) {
    return (
      <Empty
        title="No questions found"
        description={searchTerm 
          ? `No questions match your search "${searchTerm}"`
          : tagFilter
          ? `No questions found with tag "${tagFilter}"`
          : sortBy === "unanswered"
          ? "No unanswered questions at the moment"
          : "Be the first to ask a question!"
        }
        actionText="Ask Question"
        actionLink="/ask"
        icon="MessageCircle"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {searchTerm ? `Search results for "${searchTerm}"` :
           tagFilter ? `Questions tagged "${tagFilter}"` :
           sortBy === "unanswered" ? "Unanswered Questions" :
           "All Questions"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "newest" ? "primary" : "outline"}
            size="sm"
            onClick={() => window.location.search = "?sort=newest"}
          >
            Newest
          </Button>
          <Button
            variant={sortBy === "votes" ? "primary" : "outline"}
            size="sm"
            onClick={() => window.location.search = "?sort=votes"}
          >
            <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
            Most Votes
          </Button>
          <Button
            variant={sortBy === "unanswered" ? "primary" : "outline"}
            size="sm"
            onClick={() => window.location.search = "?sort=unanswered"}
          >
            Unanswered
          </Button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;