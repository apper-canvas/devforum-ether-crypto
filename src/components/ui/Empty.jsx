import ApperIcon from "@/components/ApperIcon";
import { Link } from "react-router-dom";

const Empty = ({ 
  title = "No content found",
  description = "There's nothing here yet",
  actionText = "Get Started",
  actionLink = "/",
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-surface border border-gray-200 rounded-lg">
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      <Link
        to={actionLink}
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        <ApperIcon name="Plus" className="w-4 h-4" />
        {actionText}
      </Link>
    </div>
  );
};

export default Empty;