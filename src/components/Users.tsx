import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  AlertTriangle, 
  Ban, 
  Clock, 
  Download,
  Map,
  Activity,
  Filter,
  MoreHorizontal,
  Shield,
  Smartphone,
  X
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'react-hot-toast';
import { User } from '@/services/types';

interface User {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  lastLoginDate: string;
  accountStatus: 'active' | 'inactive';
  onlineStatus: 'online' | 'offline';
  totalSessions: number;
  lastSessionDate: string | null;
  reportedIssues: number;
  verificationStatus: 'verified' | 'unverified';
  loginAttempts: number;
  deviceInfo: string;
  location: string;
}

interface UserMetrics {
  totalActive: number;
  newToday: number;
  currentlyOnline: number;
  reportedIssues: number;
}

const Users: React.FC = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');
  const [timeRange, setTimeRange] = useState('24h');
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [metrics, setMetrics] = useState<UserMetrics>({
    totalActive: 0,
    newToday: 0,
    currentlyOnline: 0,
    reportedIssues: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users/monitor');
        const data = await response.json() as User[]; // Explicitly type the data

        // Calculate metrics with proper typing
        const activeUsers = data.filter((user: User) => user.accountStatus === 'active');
        const onlineUsers = data.filter((user: User) => user.onlineStatus === 'online');
        const todayUsers = data.filter((user: User) => {
          const today = new Date().toISOString().split('T')[0];
          return user.registrationDate.includes(today);
        });
        const issues = data.reduce((acc: number, user: User) => acc + (user.reportedIssues || 0), 0);

        setMetrics({
          totalActive: activeUsers.length,
          currentlyOnline: onlineUsers.length,
          newToday: todayUsers.length,
          reportedIssues: issues
        });

      } catch (error) {
        setError('Failed to fetch user monitoring data');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    // Set up real-time updates if needed
    const interval = setInterval(fetchUsers, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);


  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleExportData = () => {
    const csvData = filteredUsers.map(user => ({
      ...user,
      registrationDate: new Date(user.registrationDate).toLocaleDateString(),
      lastLoginDate: new Date(user.lastLoginDate).toLocaleDateString()
    }));
    
    // Implementation of CSV export
    console.log('Exporting user data:', csvData);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    // Implement time range filtering logic
  };

  const handleFlagUser = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}/flag`, { method: 'POST' });
      // Update user list or show notification
    } catch (error) {
      console.error('Error flagging user:', error);
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);


  const renderMetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
          <Shield className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalActive}</div>
        </CardContent>
      </Card>
      {/* Similar cards for other metrics */}
    </div>
  );

  const renderUserDetails = () => (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform ${
      showUserDetails ? 'translate-x-0' : 'translate-x-full'
    } transition-transform duration-200 ease-in-out overflow-y-auto`}>
      {selectedUser && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">User Details</h3>
            <button 
              onClick={() => setShowUserDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* User details content */}
        </div>
      )}
    </div>
  );


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Monitoring</h2>
        <div className="flex space-x-2">
          <Button onClick={handleExportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Cards */}
      {renderMetricsCards()}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or location..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.onlineStatus === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.onlineStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLoginDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleFlagUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === i + 1
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>

      {/* User Details Sidebar */}
      {renderUserDetails()}
    </div>
  );
};

export default Users;