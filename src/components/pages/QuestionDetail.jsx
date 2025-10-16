import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import VoteControls from "@/components/molecules/VoteControls";
import UserBadge from "@/components/molecules/UserBadge";
import AnswerCard from "@/components/organisms/AnswerCard";
import CommentThread from "@/components/organisms/CommentThread";
import Tag from "@/components/atoms/Tag";
import Button from "@/components/atoms/Button";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { parseMarkdown } from "@/utils/markdown";
import { questionService } from "@/services/api/questionService";
import { answerService } from "@/services/api/answerService";
import { toast } from "react-toastify";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
const [comments, setComments] = useState([]);
  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError("");
      const questionData = await questionService.getById(parseInt(id));
      const answersData = await answerService.getByQuestionId(parseInt(id));
      
      setQuestion(questionData);
      setAnswers(answersData);
    } catch (err) {
      setError("Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const handleVote = async (targetId, voteValue, targetType = "question") => {
    if (targetType === "question") {
      setQuestion(prev => ({
        ...prev,
        votes: prev.votes + (voteValue || 0)
      }));
    } else {
      setAnswers(prev => prev.map(a => 
        a.id === targetId 
          ? { ...a, votes: a.votes + (voteValue || 0) }
          : a
      ));
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    setAnswers(prev => prev.map(a => ({
      ...a,
      isAccepted: a.id === answerId
    })));
    
    setQuestion(prev => ({
      ...prev,
      acceptedAnswerId: answerId
    }));
    
    toast.success("Answer accepted!");
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setSubmitting(true);
    try {
      const answer = await answerService.create({
        questionId: parseInt(id),
        body: newAnswer,
        authorId: "current-user",
        authorName: "Current User",
        authorReputation: 1250
      });
      
      setAnswers(prev => [...prev, answer]);
      setNewAnswer("");
      toast.success("Answer posted successfully!");
    } catch (err) {
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuestion} />;
  if (!question) return <Error message="Question not found" />;

  const canAcceptAnswer = true; // In real app, check if current user is question author

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-primary hover:underline">Questions</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{question.title}</span>
      </nav>

      {/* Question */}
      <div className="bg-surface border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
        <div className="flex gap-4">
          {/* Vote Controls */}
          <VoteControls
            votes={question.votes}
            targetId={question.id}
            targetType="question"
            onVote={(id, vote) => handleVote(id, vote, "question")}
            className="flex-shrink-0"
          />

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {question.title}
            </h1>
            
            <div 
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(question.body) }}
            />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Tag key={tag} variant="primary">
                  {tag}
                </Tag>
              ))}
            </div>
            
            {/* Question Meta */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-500">
                <span>asked {question.createdAt}</span>
                <span>{question.views} views</span>
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

          <CommentThread 
            targetType="question" 
            targetId={question.id} 
          />
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {answers.length} Answer{answers.length !== 1 ? "s" : ""}
          </h2>
          <Button variant="outline" size="sm">
            <ApperIcon name="ArrowUpDown" className="w-4 h-4 mr-2" />
            Sort by votes
          </Button>
        </div>

        {answers.length > 0 ? (
          <div className="space-y-4">
            {answers
              .sort((a, b) => {
                if (a.isAccepted && !b.isAccepted) return -1;
                if (!a.isAccepted && b.isAccepted) return 1;
                return b.votes - a.votes;
              })
              .map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  canAccept={canAcceptAnswer && !question.acceptedAnswerId}
                  onVote={(id, vote) => handleVote(id, vote, "answer")}
                  onAccept={handleAcceptAnswer}
questionId={question.id}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface border border-gray-200 rounded-lg">
            <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No answers yet</h3>
            <p className="text-gray-600 mb-6">Be the first to help solve this question!</p>
          </div>
        )}
      </div>

      {/* Answer Form */}
      <div className="bg-surface border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <MarkdownEditor
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Share your knowledge and help the community..."
          />
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Use Markdown for formatting. Code blocks are supported with syntax highlighting.
            </p>
            <Button 
              type="submit"
              disabled={!newAnswer.trim() || submitting}
            >
              {submitting ? "Posting..." : "Post Your Answer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetail;