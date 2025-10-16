import ApperIcon from "@/components/ApperIcon";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";

const UserBadge = ({ user, timestamp, showReputation = true, className }) => {
  return (
    <div className={`flex items-center gap-2 text-sm ${className || ""}`}>
      <div className="flex items-center gap-1">
        <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
        <Link 
          to={`/user/${user.id}`}
          className="text-primary hover:underline font-medium"
        >
          {user.name}
        </Link>
        {showReputation && (
          <span className="text-accent font-semibold">{user.reputation}</span>
        )}
      </div>
      {timestamp && (
        <span className="text-gray-500">
          {formatDate(timestamp)}
        </span>
      )}
    </div>
  );
};

export default UserBadge;