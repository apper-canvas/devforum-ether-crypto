import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Tag from "@/components/atoms/Tag";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";
import { questionService } from "@/services/api/questionService";
import { answerService } from "@/services/api/answerService";
import { formatDate } from "@/utils/formatDate";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [activeTab, setActiveTab] = useState("questions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const userData = await userService.getById(id);
      const allQuestions = await questionService.getAll();
      const allAnswers = await answerService.getAll();
      
      const questions = allQuestions.filter(q => q.authorId === id);
      const answers = allAnswers.filter(a => a.authorId === id);
      
      setUser(userData);
      setUserQuestions(questions);
      setUserAnswers(answers);
    } catch (err) {
      setError("Failed to load user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUserProfile} />;
  if (!user) return <Error message="User not found" />;

  const tabs = [
    { id: "questions", label: "Questions", count: userQuestions.length },
    { id: "answers", label: "Answers", count: userAnswers.length }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* User Header */}
      <div className="bg-surface border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="User" className="w-12 h-12 text-white" />
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            
            {/* Reputation */}
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
              <span className="text-xl font-semibold text-accent">{user.reputation}</span>
              <span className="text-gray-600">reputation</span>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-gray-900">{user.questionsAsked}</div>
                <div className="text-gray-600">questions</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-gray-900">{user.answersGiven}</div>
                <div className="text-gray-600">answers</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-gray-900">
                  {userAnswers.filter(a => a.isAccepted).length}
                </div>
                <div className="text-gray-600">accepted</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg text-gray-700">
                  {formatDate(user.joinedDate)}
                </div>
                <div className="text-gray-600">member since</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "questions" && (
          <div>
            {userQuestions.length > 0 ? (
              <div className="space-y-4">
                {userQuestions.map((question) => (
                  <div key={question.id} className="bg-surface border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/question/${question.id}`}
                          className="text-primary hover:text-primary/80 font-medium text-lg block mb-2"
                        >
                          {question.title}
                        </Link>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {question.tags.map((tag) => (
                            <Tag key={tag} variant="primary" size="sm">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          asked {formatDate(question.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 ml-4">
                        <div className="text-center">
                          <div className="font-semibold">{question.votes}</div>
                          <div>votes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{question.answerCount}</div>
                          <div>answers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{question.views}</div>
                          <div>views</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="MessageCircle" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600">This user hasn't asked any questions.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "answers" && (
          <div>
            {userAnswers.length > 0 ? (
              <div className="space-y-4">
                {userAnswers.map((answer) => {
                  const question = userQuestions.find(q => q.id === answer.questionId) || 
                    { id: answer.questionId, title: "Question not found" };
                    
                  return (
                    <div key={answer.id} className="bg-surface border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/question/${answer.questionId}`}
                            className="text-primary hover:text-primary/80 font-medium block mb-2"
                          >
                            {question.title}
                          </Link>
                          
                          <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                            {answer.body.substring(0, 150)}...
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>answered {formatDate(answer.createdAt)}</span>
                            {answer.isAccepted && (
                              <div className="flex items-center gap-1 text-success">
                                <ApperIcon name="CheckCircle" className="w-4 h-4" />
                                <span>accepted</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600 ml-4">
                          <div className="font-semibold">{answer.votes}</div>
                          <div>votes</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No answers yet</h3>
                <p className="text-gray-600">This user hasn't provided any answers.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;