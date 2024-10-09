// Users.tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  lastLoginDate: string;
  accountStatus: 'active' | 'inactive';
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Number of users per page

  useEffect(() => {
    // Simulate fetching users from an API
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); // Replace with your actual API endpoint
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Users</h2>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Users..."
          className="border p-2 text-gray-800" // Darker text color
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New User</button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-gray-800">User ID</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Name</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Email</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Registration Date</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Last Login Date</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Account Status</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Actions</th> {/* Darker text color */}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border p-2 text-gray-800">{user.id}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{user.name}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{user.email}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{user.registrationDate}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{user.lastLoginDate}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{user.accountStatus}</td> {/* Darker text color */}
              <td className="border p-2">
                <button className="text-blue-500">View</button>
                <button className="text-yellow-500 mx-2">Edit</button>
                <button className="text-red-500">Disable</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        {/* Pagination */}
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
