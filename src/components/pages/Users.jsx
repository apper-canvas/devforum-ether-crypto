import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";
import { formatDate } from "@/utils/formatDate";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("reputation");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "reputation":
        filtered.sort((a, b) => b.reputation - a.reputation);
        break;
      case "joined":
        filtered.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, sortBy, users]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600 mb-6">
          Browse our community of developers and their contributions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
            <ApperIcon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
            />
          </div>
          
          {/* Sort Controls */}
          <div className="flex gap-2">
            <Button
              variant={sortBy === "reputation" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSortBy("reputation")}
            >
              <ApperIcon name="Trophy" className="w-4 h-4 mr-1" />
              Reputation
            </Button>
            <Button
              variant={sortBy === "joined" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSortBy("joined")}
            >
              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
              Newest
            </Button>
            <Button
              variant={sortBy === "name" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSortBy("name")}
            >
              <ApperIcon name="SortAsc" className="w-4 h-4 mr-1" />
              Name
            </Button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <Link
            key={user.id}
            to={`/user/${user.id}`}
            className="bg-surface border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
          >
            <div className="text-center">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="User" className="w-8 h-8 text-white" />
              </div>
              
              {/* Name */}
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {user.name}
              </h3>
              
              {/* Reputation */}
              <div className="flex items-center justify-center gap-1 mb-3">
                <ApperIcon name="Trophy" className="w-4 h-4 text-accent" />
                <span className="font-semibold text-accent">{user.reputation}</span>
                <span className="text-gray-500 text-sm">reputation</span>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{user.questionsAsked}</div>
                  <div className="text-gray-500">questions</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.answersGiven}</div>
                  <div className="text-gray-500">answers</div>
                </div>
              </div>
              
              {/* Join Date */}
              <div className="text-xs text-gray-500 mt-3">
                Joined {formatDate(user.joinedDate)}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            No users match your search "{searchTerm}". Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default Users;