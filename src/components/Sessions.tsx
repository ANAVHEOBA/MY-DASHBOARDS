// Sessions.tsx
import React, { useEffect, useState } from 'react';

interface Session {
  id: string;
  dateTime: string;
  userName: string;
  listenerName: string;
  status: 'upcoming' | 'in progress' | 'completed' | 'cancelled';
  duration: string; // e.g., "30 minutes"
  googleMeetLink: string;
  notes?: string;
  feedback?: {
    userFeedback: string;
    listenerFeedback: string;
  };
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10); // Number of sessions per page
  const [showCalendar, setShowCalendar] = useState(false); // For toggling calendar view
  const [showModal, setShowModal] = useState(false); // To control the modal visibility

  // State for new session details
  const [newSession, setNewSession] = useState<Partial<Session>>({
    dateTime: '',
    userName: '',
    listenerName: '',
    duration: '',
    googleMeetLink: '',
  });

  useEffect(() => {
    // Simulate fetching sessions from an API
    const fetchSessions = async () => {
      const response = await fetch('/api/sessions'); // Replace with your actual API endpoint
      const data = await response.json();
      setSessions(data);
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    setFilteredSessions(
      sessions.filter(session => 
        session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.listenerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.dateTime.includes(searchTerm)
      )
    );
  }, [searchTerm, sessions]);

  // Pagination logic
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to handle form submission
  const handleCreateSession = () => {
    const newSessionData: Session = {
      ...newSession,
      id: Math.random().toString(), // Generate a random ID for the new session
      status: 'upcoming',
    } as Session;

    setSessions((prev) => [...prev, newSessionData]);
    setShowModal(false); // Close the modal
    setNewSession({}); // Reset the new session state
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Sessions</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Sessions..."
          className="border p-2 text-gray-800" // Darker text color
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={`bg-blue-500 text-white px-4 py-2 rounded ${showCalendar ? 'bg-blue-700' : ''}`}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </button>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)} // Open the modal when clicked
        >
          Create New Session
        </button>
      </div>

      {showCalendar ? (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Calendar View</h3>
          {/* Placeholder for Calendar Component */}
          <div className="border p-4 mt-2 text-gray-800">Calendar would be rendered here</div>
        </div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-gray-900">Session ID</th> {/* Darker text color */}
              <th className="border p-2 text-gray-900">Date and Time</th> {/* Darker text color */}
              <th className="border p-2 text-gray-800">User Name</th> {/* Darker text color */}
              <th className="border p-2 text-gray-800">Listener Name</th> {/* Darker text color */}
              <th className="border p-2 text-gray-800">Status</th> {/* Darker text color */}
              <th className="border p-2 text-gray-800">Duration</th> {/* Darker text color */}
              <th className="border p-2 text-gray-800">Google Meet Link</th> {/* Darker text color */}
              <th className="border p-2 text-gray-800">Actions</th> {/* Darker text color */}
            </tr>
          </thead>
          <tbody>
            {currentSessions.map(session => (
              <tr key={session.id} className="hover:bg-gray-500">
                <td className="border p-2 text-gray-800">{session.id}</td> {/* Darker text color */}
                <td className="border p-2 text-gray-800">{new Date(session.dateTime).toLocaleString()}</td> {/* Darker text color */}
                <td className="border p-2 text-gray-800">{session.userName}</td> {/* Darker text color */}
                <td className="border p-2 text-gray-800">{session.listenerName}</td> {/* Darker text color */}
                <td className="border p-2 text-gray-800">{session.status}</td> {/* Darker text color */}
                <td className="border p-2 text-gray-800">{session.duration}</td> {/* Darker text color */}
                <td className="border p-2 text-gray-800">
                  <a href={session.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    Join Meeting
                  </a>
                </td>
                <td className="border p-2">
                  <button className="text-blue-500" onClick={() => console.log(`Viewing ${session.id}`)}>View</button>
                  <button className="text-yellow-500 mx-2" onClick={() => console.log(`Editing ${session.id}`)}>Edit</button>
                  <button className="text-red-500" onClick={() => console.log(`Cancelling ${session.id}`)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4">
        {/* Pagination */}
        {Array.from({ length: Math.ceil(filteredSessions.length / sessionsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for Creating New Session */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Session</h2>
      <label className="block mb-2 text-gray-800">Date and Time:</label>
      <input
        type="datetime-local"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newSession.dateTime}
        onChange={(e) => setNewSession({ ...newSession, dateTime: e.target.value })}
      />
      <label className="block mb-2 text-gray-800">User Name:</label>
      <input
        type="text"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newSession.userName}
        onChange={(e) => setNewSession({ ...newSession, userName: e.target.value })}
      />
      <label className="block mb-2 text-gray-800">Listener Name:</label>
      <input
        type="text"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newSession.listenerName}
        onChange={(e) => setNewSession({ ...newSession, listenerName: e.target.value })}
      />
      <label className="block mb-2 text-gray-800">Duration:</label>
      <input
        type="text"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newSession.duration}
        onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
      />
      <label className="block mb-2 text-gray-800">Google Meet Link:</label>
      <input
        type="url"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newSession.googleMeetLink}
        onChange={(e) => setNewSession({ ...newSession, googleMeetLink: e.target.value })}
      />

      <div className="flex justify-end">
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded mr-2" 
          onClick={() => setShowModal(false)} // Close the modal
        >
          Cancel
        </button>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded" 
          onClick={handleCreateSession} // Create the session
        >
          Create Session
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Sessions;
