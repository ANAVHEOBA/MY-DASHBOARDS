import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, XCircle } from 'lucide-react';

const API_URL = 'https://ready-back-end.onrender.com';

interface User {
  _id: string;  // Changed from id to _id to match MongoDB
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
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

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const skip = (currentPage - 1) * usersPerPage;
        const response = await fetch(
          `${API_URL}/users?skip=${skip}&limit=${usersPerPage}`
        );

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

    fetchUsers();
  }, [currentPage, usersPerPage]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

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
        <button className="p-1 text-blue-500 hover:text-blue-700">
          <Eye className="h-5 w-5" />
        </button>
        <button className="p-1 text-yellow-500 hover:text-yellow-700">
          <Edit2 className="h-5 w-5" />
        </button>
        <button className="p-1 text-red-500 hover:text-red-700">
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Users</h2>
        <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add New User</span>
        </button>
      </div>

      {/* Search section */}
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
          {/* Mobile View */}
          <div className="sm:hidden space-y-4">
            {filteredUsers.map(renderUserCard)}
          </div>

          {/* Desktop View */}
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
                        <button className="text-blue-500 hover:text-blue-700">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-500 hover:text-yellow-700">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {Array.from({ length: Math.ceil(totalUsers / usersPerPage) }, (_, index) => (
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
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Users;