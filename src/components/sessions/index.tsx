import React, { useState, useEffect } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { sessionApi } from '@/services/api';
import { Session, SessionFilterOptions, Listener } from '@/types';
import { MetricsCards } from './MetricsCards';
import { SessionFilters } from './SessionFilters';
import { SessionSearch } from './SessionSearch';
import { SessionTable } from './SessionTable';
import { AssignModal } from './AssignModal';
import { useListeners } from '@/hooks/useLIsteners';

const Sessions: React.FC = () => {
  const { sessions, metrics, loading, error, refreshSessions } = useSessions();
  const { listeners, loading: listenersLoading } = useListeners();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);
  
  const [filters, setFilters] = useState<SessionFilters>({
    status: 'all',
    priority: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    const filtered = sessions.filter(session => {
      const matchesSearch = 
        session.userName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (session.listenerName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ?? false);
      
      const matchesStatus = filters.status === 'all' || session.status === filters.status;
      const matchesPriority = filters.priority === 'all' || session.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    setFilteredSessions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, sessions]);

  const handleAssignSession = async (sessionId: string, listenerId: string) => {
    try {
      await sessionApi.assignSession(sessionId, listenerId);
      await refreshSessions();
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error assigning session:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleFilterChange = (newFilters: Partial<SessionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
      </div>

      <MetricsCards metrics={metrics} />

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SessionSearch 
            searchTerm={filters.searchTerm}
            onSearchChange={(term) => handleFilterChange({ searchTerm: term })}
          />
          <Filters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <SessionTable
        sessions={currentSessions}
        onAssignClick={(session) => {
          setSelectedSession(session);
          setShowAssignModal(true);
        }}
        onViewClick={setSelectedSession}
      />

      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: Math.ceil(filteredSessions.length / sessionsPerPage) }, (_, i) => (
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

      {showAssignModal && (
        <AssignModal
          session={selectedSession}
          listeners={listeners}
          onAssign={handleAssignSession}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
};

export default Sessions;