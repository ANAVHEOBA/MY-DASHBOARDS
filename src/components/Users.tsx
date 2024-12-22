import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { getAuthHeaders, handleUnauthorized } from '../utils/api';

const API_URL = 'https://ready-back-end.onrender.com';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  bio?: string;
  contact?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  occupation?: 'employed' | 'self-employed' | 'unemployed' | 'student';
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  _id: string;
  listenerId: string;
  userId: string;
  time: string;
  topic: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
  currentPage: number;
}

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ userId, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
          return handleUnauthorized(response);
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/user/${userId}/sessions`, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
          return handleUnauthorized(response);
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch user sessions');
        }

        const data = await response.json();
        setSessions(data.sessions);
      } catch (err) {
        console.error('Error fetching user sessions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user sessions');
      }
    };

    fetchUserDetails();
    fetchUserSessions();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <p className="text-red-500 text-center">{error || 'User not found'}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="h-6 w-6">✖</span>
            </button>
          </div>

          <div className="space-y-4">
            <img
              src={user.picture || 'https://via.placeholder.com/150'}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-32 h-32 rounded-full mx-auto"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact</label>
                <p className="text-gray-900">{user.contact || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900">{user.gender || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Occupation</label>
                <p className="text-gray-900">{user.occupation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="text-gray-900">{user.bio || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Joined</label>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  user.verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">User Sessions</h3>
              {sessions.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {sessions.map(session => (
                    <li key={session._id} className="border p-2 rounded">
                      <p><strong>Topic:</strong> {session.topic}</p>
                      <p><strong>Status:</strong> {session.status}</p>
                      <p><strong>Time:</strong> {new Date(session.time).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-black font-semibold text-base">No sessions found for this user.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('firstName'); // Default sorting field
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const skip = (currentPage - 1) * usersPerPage;
      const response = await fetch(
        `${API_URL}/users?skip=${skip}&limit=${usersPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.status === 401) {
        return handleUnauthorized(response);
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: PaginatedResponse = await response.json();
      setUsers(data.users);
      setTotalUsers(data.total);
      setFilteredUsers(data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage, sortBy, sortOrder]); // Add sortBy and sortOrder to dependencies

  useEffect(() => {
    setFilteredUsers(
      users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  const exportUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users/export`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        return handleUnauthorized(response);
      }

      if (!response.ok) {
        throw new Error('Failed to export users');
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_export.csv'; // Set the filename for the download
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Failed to export users. Please try again.');
    }
  };

  const renderUserCard = (user: User) => (
    <div key={user._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.verified 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.verified ? 'Verified' : 'Unverified'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-medium">Registered:</span> {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div>
          <span className="font-medium">Last Updated:</span> {new Date(user.updatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button 
          className="p-1 text-blue-500 hover:text-blue-700"
          onClick={() => handleViewUser(user._id)}
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Users</h2>
        <div className="flex space-x-2">
          <button 
            className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            onClick={exportUsers}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Export Users</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg p-2 bg-white text-gray-800"
          >
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
            <option value="createdAt">Registration Date</option>
            <option value="verified">Status</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg p-2 bg-white text-gray-800"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            onClick={() => {
              setCurrentPage(1); // Reset to first page when sorting changes
              fetchUsers(); // Fetch users with new sorting
            }}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sort
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">
          {error}
        </div>
      ) : (
        <>
          <div className="sm:hidden space-y-4">
            {filteredUsers.map(renderUserCard)}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                    <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-500">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleViewUser(user._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {Array.from(
              { length: Math.ceil(totalUsers / usersPerPage) },
              (_, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      )}

      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Users;