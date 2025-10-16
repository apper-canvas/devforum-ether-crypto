import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-accent" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button>
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/ask">
            <Button variant="outline">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Popular Sections</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-primary hover:underline">Questions</Link>
            <Link to="/tags" className="text-primary hover:underline">Tags</Link>
            <Link to="/users" className="text-primary hover:underline">Users</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;