import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Tag from "@/components/atoms/Tag";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { questionService } from "@/services/api/questionService";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadTags = async () => {
    try {
      setLoading(true);
      setError("");
      const questions = await questionService.getAll();
      
      const tagCounts = {};
      let totalQuestions = 0;
      
      questions.forEach(question => {
        question.tags.forEach(tag => {
          if (!tagCounts[tag]) {
            tagCounts[tag] = {
              name: tag,
              questionCount: 0,
              description: getTagDescription(tag)
            };
          }
          tagCounts[tag].questionCount++;
          totalQuestions++;
        });
      });
      
      const sortedTags = Object.values(tagCounts)
        .sort((a, b) => b.questionCount - a.questionCount);
        
      setTags(sortedTags);
      setFilteredTags(sortedTags);
    } catch (err) {
      setError("Failed to load tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTagDescription = (tagName) => {
    const descriptions = {
      javascript: "A high-level, interpreted programming language for web development",
      python: "A versatile, high-level programming language known for its simplicity",
      react: "A JavaScript library for building user interfaces",
      "node.js": "A JavaScript runtime built on Chrome's V8 JavaScript engine",
      css: "Cascading Style Sheets for styling web pages",
      html: "HyperText Markup Language for structuring web content",
      sql: "Structured Query Language for managing relational databases",
      java: "A class-based, object-oriented programming language",
      "c++": "A general-purpose programming language with object-oriented features",
      php: "A server-side scripting language for web development",
      typescript: "A typed superset of JavaScript that compiles to plain JavaScript",
      angular: "A platform for building mobile and desktop web applications",
      vue: "A progressive JavaScript framework for building user interfaces",
      mongodb: "A document-based, NoSQL database program",
      express: "A minimal web application framework for Node.js",
      git: "A distributed version control system",
      docker: "A platform for developing, shipping, and running applications",
      aws: "Amazon Web Services cloud computing platform",
      mysql: "An open-source relational database management system",
      postgresql: "An advanced open-source relational database"
    };
    
    return descriptions[tagName.toLowerCase()] || `Questions about ${tagName}`;
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tags);
    }
  }, [searchTerm, tags]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTags} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
        <p className="text-gray-600 mb-6">
          A tag is a keyword that categorizes your question with other, similar questions.
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
          />
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => (
          <Link
            key={tag.name}
            to={`/?tag=${tag.name}`}
            className="bg-surface border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <Tag variant="primary" className="group-hover:bg-primary/20">
                {tag.name}
              </Tag>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <ApperIcon name="MessageCircle" className="w-4 h-4" />
                {tag.questionCount}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tag.description}
            </p>
          </Link>
        ))}
      </div>

      {filteredTags.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
          <p className="text-gray-600">
            No tags match your search "{searchTerm}". Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tags;