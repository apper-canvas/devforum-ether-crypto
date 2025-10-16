import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tag from "@/components/atoms/Tag";
import ApperIcon from "@/components/ApperIcon";
import { questionService } from "@/services/api/questionService";

const Sidebar = () => {
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularTags = async () => {
      try {
        const questions = await questionService.getAll();
        const tagCounts = {};
        
        questions.forEach(question => {
          question.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });
        
        const sortedTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([tag, count]) => ({ name: tag, count }));
          
        setPopularTags(sortedTags);
      } catch (error) {
        console.error("Failed to load popular tags:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularTags();
  }, []);

  const stats = [
    { label: "Questions", value: "12.5k", icon: "MessageCircle" },
    { label: "Answers", value: "28.3k", icon: "MessageSquare" },
    { label: "Users", value: "4.2k", icon: "Users" },
    { label: "Tags", value: "1.8k", icon: "Tag" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-surface border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ApperIcon name="BarChart3" className="w-4 h-4" />
          Community Stats
        </h3>
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ApperIcon name={stat.icon} className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className="font-semibold text-primary">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-surface border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ApperIcon name="Hash" className="w-4 h-4" />
          Popular Tags
        </h3>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.name}
                to={`/?tag=${tag.name}`}
                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 transition-colors group"
              >
                <Tag variant="primary" className="group-hover:bg-primary/20">
                  {tag.name}
                </Tag>
                <span className="text-xs text-gray-500">{tag.count}</span>
              </Link>
            ))}
          </div>
        )}
        <Link
          to="/tags"
          className="block text-center text-sm text-primary hover:text-primary/80 mt-3 pt-3 border-t border-gray-200"
        >
          View all tags →
        </Link>
      </div>

      {/* Quick Links */}
      <div className="bg-surface border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ApperIcon name="Bookmark" className="w-4 h-4" />
          Quick Links
        </h3>
        <div className="space-y-2">
          <Link
            to="/ask"
            className="flex items-center gap-2 py-2 px-3 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Ask a Question
          </Link>
          <Link
            to="/?sort=unanswered"
            className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          >
            <ApperIcon name="HelpCircle" className="w-4 h-4" />
            Unanswered Questions
          </Link>
          <Link
            to="/?sort=votes"
            className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          >
            <ApperIcon name="TrendingUp" className="w-4 h-4" />
            Top Voted
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;