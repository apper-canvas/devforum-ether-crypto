import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";
import Tag from "@/components/atoms/Tag";
import ApperIcon from "@/components/ApperIcon";
import { questionService } from "@/services/api/questionService";
import { toast } from "react-toastify";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const popularTags = [
    "javascript", "python", "react", "node.js", "css", "html", "sql", "java", "c++", "php"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }
    
    if (!formData.body.trim()) {
      newErrors.body = "Question body is required";
    } else if (formData.body.length < 20) {
      newErrors.body = "Please provide more details (at least 20 characters)";
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    } else if (formData.tags.length > 5) {
      newErrors.tags = "Maximum 5 tags allowed";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addTag = (tag) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !formData.tags.includes(normalizedTag)) {
      if (formData.tags.length < 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, normalizedTag]
        }));
        setTagInput("");
      } else {
        toast.error("Maximum 5 tags allowed");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const question = await questionService.create({
        title: formData.title.trim(),
        body: formData.body.trim(),
        tags: formData.tags,
        authorId: "current-user",
        authorName: "Current User",
        authorReputation: 1250
      });
      
      toast.success("Question posted successfully!");
      navigate(`/question/${question.id}`);
    } catch (error) {
      toast.error("Failed to post question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Public Question</h1>
        <p className="text-gray-600">
          Get help from the community by asking clear, specific questions about programming.
        </p>
      </div>

      <div className="bg-surface border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Be specific and imagine you're asking a question to another person
            </p>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. How to center a div with CSS flexbox?"
              className={errors.title ? "border-error focus:ring-error focus:border-error" : ""}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error">{errors.title}</p>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are the details of your problem?
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Include all the information someone would need to answer your question
            </p>
            <MarkdownEditor
              value={formData.body}
              onChange={(e) => handleInputChange("body", e.target.value)}
              placeholder="Describe your problem in detail. Include any code, error messages, and what you've already tried..."
              className={errors.body ? "[&_textarea]:border-error [&_textarea]:focus:ring-error [&_textarea]:focus:border-error" : ""}
            />
            {errors.body && (
              <p className="mt-1 text-sm text-error">{errors.body}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Add up to 5 tags to describe what your question is about
            </p>
            
            {/* Current Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-primary/60 hover:text-primary"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Tag Input */}
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyPress}
              placeholder="Type a tag and press Enter"
              className={errors.tags ? "border-error focus:ring-error focus:border-error" : ""}
              disabled={formData.tags.length >= 5}
            />
            
            {/* Popular Tags */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags
                  .filter(tag => !formData.tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                  <Tag
                    key={tag}
                    variant="default"
                    onClick={() => addTag(tag)}
                    className="cursor-pointer"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
            
            {errors.tags && (
              <p className="mt-1 text-sm text-error">{errors.tags}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              By posting your question, you agree to our community guidelines.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Your Question"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;