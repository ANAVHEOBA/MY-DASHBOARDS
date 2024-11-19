import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from '@/hooks/useUsers';
import { UserMetrics } from './UserMetrics';
import { UserSearch } from './UserSearch';
import { UserTable } from './UserTable';
import { UserDetails } from './UserDetails';
import { UserPagination } from './UserPagination';

const Users: React.FC = () => {
  const {
    users,
    metrics,
    loading,
    error,
    searchTerm,
    timeRange,
    currentPage,
    selectedUser,
    showUserDetails,
    filteredUsers,
    handleSearch,
    handleTimeRangeChange,
    handleExportData,
    handleUserSelect,
    handleFlagUser,
    handlePageChange,
    closeUserDetails
  } = useUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">{error}</div>
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

      <UserMetrics metrics={metrics} />
      <UserSearch value={searchTerm} onChange={handleSearch} />
      
      <UserTable 
        users={filteredUsers}
        onUserSelect={handleUserSelect}
        onFlagUser={handleFlagUser}
      />
      
      <UserPagination 
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        onPageChange={handlePageChange}
      />

      <UserDetails 
        user={selectedUser}
        isOpen={showUserDetails}
        onClose={closeUserDetails}
      />
    </div>
  );
};

export default Users;