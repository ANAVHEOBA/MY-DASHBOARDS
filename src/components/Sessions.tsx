import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Clock, 
  Calendar, 
  X, 
  Eye, 
  AlertTriangle,
  Video,
  User,
  Headphones,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Session {
  id: string;
  dateTime: string;
  userId: string;
  userName: string;
  listenerId: string | null;
  listenerName: string | null;
  status: 'unassigned' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  duration: string;
  googleMeetLink?: string;
  priority: 'low' | 'medium' | 'high';
  requestDetails: string;
  preferredLanguages: string[];
  specialtyRequirements?: string[];
}

interface SessionMetrics {
  totalSessions: number;
  unassignedSessions: number;
  inProgressSessions: number;
  completedToday: number;
  averageWaitTime: number;
}

interface Listener {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
  currentLoad: number;
}

const Sessions: React.FC = () => {
  // Data states
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [availableListeners, setAvailableListeners] = useState<Listener[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Session['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Session['priority'] | 'all'>('all');

  // Metrics state
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalSessions: 0,
    unassignedSessions: 0,
    inProgressSessions: 0,
    completedToday: 0,
    averageWaitTime: 0
  });
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [sessionsResponse, listenersResponse] = await Promise.all([
          fetch('/api/sessions/monitor'),
          fetch('/api/listeners/available')
        ]);

        const sessionsData = await sessionsResponse.json() as Session[];
        const listenersData = await listenersResponse.json() as Listener[];

        setSessions(sessionsData);
        setAvailableListeners(listenersData);

        // Calculate metrics with proper typing
        const unassigned = sessionsData.filter((session: Session) => 
          session.status === 'unassigned'
        ).length;
        
        const inProgress = sessionsData.filter((session: Session) => 
          session.status === 'in-progress'
        ).length;
        
        const completedToday = sessionsData.filter((session: Session) => {
          const today = new Date().toISOString().split('T')[0];
          return session.status === 'completed' && session.dateTime.includes(today);
        }).length;

        setMetrics({
          totalSessions: sessionsData.length,
          unassignedSessions: unassigned,
          inProgressSessions: inProgress,
          completedToday,
          averageWaitTime: calculateAverageWaitTime(sessionsData)
        });

      } catch (error) {
        setError('Failed to fetch session data');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = sessions.filter(session => {
      const matchesSearch = 
        session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.listenerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || session.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    setFilteredSessions(filtered);
  }, [searchTerm, sessions, statusFilter, priorityFilter]);



  const calculateAverageWaitTime = (sessions: Session[]): number => {
    const unassignedSessions = sessions.filter(s => s.status === 'unassigned');
    if (!unassignedSessions.length) return 0;

    return unassignedSessions.reduce((acc, session) => {
      const waitTime = Date.now() - new Date(session.dateTime).getTime();
      return acc + (waitTime / (1000 * 60)); // Convert to minutes
    }, 0) / unassignedSessions.length;
  };

  const handleAssignSession = async (sessionId: string, listenerId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listenerId }),
      });

      if (!response.ok) throw new Error('Failed to assign session');

      const updatedSession = await response.json();
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId ? updatedSession : session
        )
      );
      setShowAssignModal(false);

    } catch (error) {
      console.error('Error assigning session:', error);
      // Handle error appropriately
    }
  };

  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

  const getStatusColor = (status: Session['status']) => {
    const colors = {
      'unassigned': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getPriorityBadge = (priority: Session['priority']) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[priority]}`}>
        {priority}
      </span>
    );
  };


  const renderMetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500">Total Sessions</div>
        <div className="mt-1 text-2xl font-semibold">{metrics.totalSessions}</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500">Unassigned</div>
        <div className="mt-1 text-2xl font-semibold text-yellow-600">
          {metrics.unassignedSessions}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500">In Progress</div>
        <div className="mt-1 text-2xl font-semibold text-green-600">
          {metrics.inProgressSessions}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500">Completed Today</div>
        <div className="mt-1 text-2xl font-semibold text-blue-600">
          {metrics.completedToday}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500">Avg. Wait Time</div>
        <div className="mt-1 text-2xl font-semibold">
          {Math.round(metrics.averageWaitTime)}m
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        className="border rounded-md px-3 py-2"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as Session['status'] | 'all')}
      >
        <option value="all">All Status</option>
        <option value="unassigned">Unassigned</option>
        <option value="assigned">Assigned</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        className="border rounded-md px-3 py-2"
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value as Session['priority'] | 'all')}
      >
        <option value="all">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>
    </div>
  );


  const renderSessionTable = () => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date/Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listener
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
  {currentSessions.map((session: Session) => (
    <tr key={session.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(session.dateTime).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(session.dateTime).toLocaleTimeString()}
        </div>
      </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {session.userName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getPriorityBadge(session.priority)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {session.listenerName || (
                  <button
                    onClick={() => {
                      setSelectedSession(session);
                      setShowAssignModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Assign Listener
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => setSelectedSession(session)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Eye className="h-5 w-5" />
                </button>
                {session.status === 'unassigned' && (
                  <button
                    onClick={() => {
                      setSelectedSession(session);
                      setShowAssignModal(true);
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAssignModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Assign Listener
            </h3>
            
            <div className="mt-2">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Session Details</h4>
                <p className="text-sm text-gray-900">User: {selectedSession?.userName}</p>
                <p className="text-sm text-gray-900">
                  Time: {new Date(selectedSession?.dateTime || '').toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                {availableListeners.map(listener => (
                  <button
                    key={listener.id}
                    onClick={() => handleAssignSession(selectedSession?.id!, listener.id)}
                    className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium">{listener.name}</div>
                    <div className="text-sm text-gray-500">
                      Languages: {listener.languages.join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Current Load: {listener.currentLoad} sessions
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setShowAssignModal(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
      </div>

      {renderMetricsCards()}

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {renderFilters()}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <>
          {renderSessionTable()}
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
        </>
      )}

      {showAssignModal && renderAssignModal()}
    </div>
  );
};

export default Sessions;