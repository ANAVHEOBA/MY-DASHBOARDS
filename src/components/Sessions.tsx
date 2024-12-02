import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  X, 
  Eye, 
  Edit2, 
  XCircle, 
  Video,
  Clock,
  Headphones 
} from 'lucide-react';

interface Session {
  _id: string;
  dateTime: string;
  userName: string;
  listenerName: string;
  status: 'upcoming' | 'in progress' | 'completed' | 'cancelled';
  duration: string;
  googleMeetLink: string;
  notes?: string;
  feedback?: {
    userFeedback: string;
    listenerFeedback: string;
  };
}

const API_URL = 'https://ready-back-end.onrender.com';

// Helper component for status badges
const StatusBadge: React.FC<{ status: Session['status'] }> = ({ status }) => {
  const statusClasses = {
    'upcoming': 'bg-blue-100 text-blue-800',
    'in progress': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const Sessions: React.FC = () => {
  // State Management
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);
  const [totalSessions, setTotalSessions] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newSession, setNewSession] = useState<Partial<Session>>({
    dateTime: '',
    userName: '',
    listenerName: '',
    duration: '',
    googleMeetLink: '',
  });

    // Fetch Sessions
    useEffect(() => {
      const fetchSessions = async () => {
        try {
          setIsLoading(true);
          const skip = (currentPage - 1) * sessionsPerPage;
          const response = await fetch(
            `${API_URL}/sessions/platform/all?limit=${sessionsPerPage}&skip=${skip}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch sessions');
          }
  
          const data = await response.json();
          console.log('Fetched sessions:', data);
  
          if (data && Array.isArray(data.sessions)) {
            setSessions(data.sessions);
            setTotalSessions(data.total || data.sessions.length);
            setFilteredSessions(data.sessions);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (err) {
          console.error('Error fetching sessions:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchSessions();
    }, [currentPage, sessionsPerPage]);
  
    // Filter Sessions
    useEffect(() => {
      if (!Array.isArray(sessions)) {
        setFilteredSessions([]);
        return;
      }
  
      const filtered = sessions.filter(session => {
        if (!session) return false;
        const searchTermLower = searchTerm.toLowerCase();
        return (
          session.userName?.toLowerCase().includes(searchTermLower) ||
          session.listenerName?.toLowerCase().includes(searchTermLower) ||
          new Date(session.dateTime).toLocaleDateString().includes(searchTerm)
        );
      });
  
      setFilteredSessions(filtered);
    }, [searchTerm, sessions]);
  
    // Pagination handler
    const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    // Create session handler
    const handleCreateSession = async () => {
      if (!newSession.dateTime || !newSession.userName || !newSession.listenerName) {
        alert('Please fill in all required fields');
        return;
      }
  
      try {
        const response = await fetch(`${API_URL}/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newSession,
            status: 'upcoming',
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to create session');
        }
  
        const data = await response.json();
        setSessions(prev => [...prev, data]);
        setShowModal(false);
        setNewSession({
          dateTime: '',
          userName: '',
          listenerName: '',
          duration: '',
          googleMeetLink: '',
        });
  
        // Refresh the sessions list
    const skip = (currentPage - 1) * sessionsPerPage;
    const refreshResponse = await fetch(
      `${API_URL}/sessions/platform/all?limit=${sessionsPerPage}&skip=${skip}`
    );
    const refreshData = await refreshResponse.json();
    setSessions(refreshData.sessions);
    setTotalSessions(refreshData.total);

  } catch (error) {
    console.error('Error creating session:', error);
    alert('Failed to create session. Please try again.');
  }
};
  
    // Update the meeting link handler
const handleUpdateMeetingLink = async (sessionId: string, link: string) => {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/add-link`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ googleMeetLink: link }),
    });

    if (!response.ok) {
      throw new Error('Failed to update meeting link');
    }

    // Update the sessions list with the new link
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session._id === sessionId
          ? { ...session, googleMeetLink: link }
          : session
      )
    );
  
        setShowLinkModal(false);
        setSelectedSessionId(null);
        setMeetingLink('');
      } catch (error) {
        console.error('Error updating meeting link:', error);
        alert('Failed to update meeting link. Please try again.');
      }
    };

      // Mobile card renderer
  const renderMobileCard = (session: Session) => (
    <div key={session._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{session.userName}</h3>
          <p className="text-sm text-gray-500">
            {new Date(session.dateTime).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={session.status} />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Headphones className="h-4 w-4 mr-2" />
          <span>{session.listenerName}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>{new Date(session.dateTime).toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>{session.duration}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <a 
          href={session.googleMeetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <Video className="h-4 w-4 mr-1" />
          <span>Join Meet</span>
        </a>
        <div className="flex space-x-3">
          <button className="text-blue-500 hover:text-blue-700">
            <Eye className="h-5 w-5" />
          </button>
          <button 
            className="text-yellow-500 hover:text-yellow-700"
            onClick={() => {
              setSelectedSessionId(session._id);
              setMeetingLink(session.googleMeetLink || '');
              setShowLinkModal(true);
            }}
          >
            <Video className="h-5 w-5" />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Table renderer
  const renderTable = () => (
    <table className="hidden sm:table min-w-full border rounded-lg">
      <thead>
        <tr className="bg-gray-50">
          <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
          <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listener</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
          <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meet Link</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredSessions.map(session => (
          <tr key={session._id} className="hover:bg-gray-50">
            <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-800">{session._id}</td>
            <td className="px-4 py-3 text-sm text-gray-800">
              {new Date(session.dateTime).toLocaleDateString()}
              <div className="text-xs text-gray-500">
                {new Date(session.dateTime).toLocaleTimeString()}
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-800">{session.userName}</td>
            <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-800">{session.listenerName}</td>
            <td className="px-4 py-3 text-sm">
              <StatusBadge status={session.status} />
            </td>
            <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-800">{session.duration}</td>
            <td className="hidden md:table-cell px-4 py-3 text-sm">
              <a 
                href={session.googleMeetLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:text-blue-700"
              >
                Join
              </a>
            </td>
            <td className="px-4 py-3 text-sm">
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  className="text-yellow-500 hover:text-yellow-700"
                  onClick={() => {
                    setSelectedSessionId(session._id);
                    setMeetingLink(session.googleMeetLink || '');
                    setShowLinkModal(true);
                  }}
                >
                  <Video className="h-4 w-4" />
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
  );

  // Link Modal renderer
  const renderLinkModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Update Meeting Link</h2>
          <button 
            onClick={() => {
              setShowLinkModal(false);
              setSelectedSessionId(null);
              setMeetingLink('');
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Meet Link
            </label>
            <input
              type="url"
              className="w-full border rounded-md px-3 py-2 text-gray-900 font-medium"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button 
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => {
                setShowLinkModal(false);
                setSelectedSessionId(null);
                setMeetingLink('');
              }}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => selectedSessionId && handleUpdateMeetingLink(selectedSessionId, meetingLink)}
            >
              Update Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* ... rest of your existing JSX ... */}
      {showLinkModal && renderLinkModal()}
    </div>
  );
};

export default Sessions;