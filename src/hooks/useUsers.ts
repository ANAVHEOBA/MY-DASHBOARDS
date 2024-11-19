import { useState, useCallback, useEffect } from 'react';
import { userApi } from '@/services/api';
import { User, UserMetrics, UserFilters } from '@/services/types';

export const useUsers = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics>({
    totalActive: 0,
    newToday: 0,
    currentlyOnline: 0,
    reportedIssues: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Fetch users and metrics
  const fetchUsers = useCallback(async (filters?: UserFilters) => {
    try {
      setLoading(true);
      const data = await userApi.getUsers(filters);
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMetrics = useCallback(async (timeRange: string) => {
    try {
      const data = await userApi.getUserMetrics(timeRange);
      setMetrics(data);
    } catch (err) {
      setError('Failed to fetch metrics');
    }
  }, []);

  // Event handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.location.toLowerCase().includes(term.toLowerCase())
      )
    );
  }, [users]);

  const handleTimeRangeChange = useCallback((range: string) => {
    setTimeRange(range);
    fetchUsers({ timeRange: range });
    fetchMetrics(range);
  }, [fetchUsers, fetchMetrics]);

  const handleExportData = useCallback(async () => {
    try {
      await userApi.exportUsers({ timeRange });
    } catch (err) {
      setError('Failed to export data');
    }
  }, [timeRange]);

  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  }, []);

  const handleFlagUser = useCallback(async (userId: string) => {
    try {
      await userApi.flagUser(userId, 'Suspicious activity');
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to flag user');
    }
  }, [fetchUsers]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const closeUserDetails = useCallback(() => {
    setShowUserDetails(false);
    setSelectedUser(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers({ timeRange });
    fetchMetrics(timeRange);

    const interval = setInterval(() => {
      fetchUsers({ timeRange });
      fetchMetrics(timeRange);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange, fetchUsers, fetchMetrics]);

  return {
    // State
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

    // Handlers
    handleSearch,
    handleTimeRangeChange,
    handleExportData,
    handleUserSelect,
    handleFlagUser,
    handlePageChange,
    closeUserDetails
  };
};