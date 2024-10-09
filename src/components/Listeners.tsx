// Listeners.tsx
import React, { useEffect, useState } from 'react';

interface Listener {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  availabilityStatus: 'available' | 'unavailable';
  sessionsConducted: number;
  averageRating: number;
}

const Listeners: React.FC = () => {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredListeners, setFilteredListeners] = useState<Listener[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listenersPerPage] = useState(10); // Number of listeners per page
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  // State for new listener details
  const [newListener, setNewListener] = useState<Partial<Listener>>({
    name: '',
    specialties: [],
    languages: [],
    availabilityStatus: 'available',
    sessionsConducted: 0,
    averageRating: 0,
  });

  useEffect(() => {
    // Simulate fetching listeners from an API
    const fetchListeners = async () => {
      const response = await fetch('/api/listeners'); // Replace with your actual API endpoint
      const data = await response.json();
      setListeners(data);
    };

    fetchListeners();
  }, []);

  useEffect(() => {
    setFilteredListeners(
      listeners.filter(listener => 
        listener.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, listeners]);

  // Pagination logic
  const indexOfLastListener = currentPage * listenersPerPage;
  const indexOfFirstListener = indexOfLastListener - listenersPerPage;
  const currentListeners = filteredListeners.slice(indexOfFirstListener, indexOfLastListener);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to handle adding a new listener
  const handleAddListener = () => {
    const newListenerData: Listener = {
      ...newListener,
      id: Math.random().toString(), // Generate a random ID for the new listener
      specialties: newListener.specialties || [],
      languages: newListener.languages || [],
    } as Listener;

    setListeners((prev) => [...prev, newListenerData]);
    setShowModal(false); // Close the modal
    setNewListener({}); // Reset the new listener state
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Listeners</h2>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Listeners..."
          className="border p-2 text-gray-800" // Darker text color
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)} // Open the modal when clicked
        >
          Add New Listener
        </button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-gray-800">Listener ID</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Name</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Specialties</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Languages Spoken</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Availability Status</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Sessions Conducted</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Average Rating</th> {/* Darker text color */}
            <th className="border p-2 text-gray-800">Actions</th> {/* Darker text color */}
          </tr>
        </thead>
        <tbody>
          {currentListeners.map(listener => (
            <tr key={listener.id} className="hover:bg-gray-100">
              <td className="border p-2 text-gray-800">{listener.id}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{listener.name}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{listener.specialties.join(', ')}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{listener.languages.join(', ')}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{listener.availabilityStatus}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{listener.sessionsConducted}</td> {/* Darker text color */}
              <td className="border p-2 text-gray-800">{listener.averageRating.toFixed(1)}</td> {/* Darker text color */}
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
        {Array.from({ length: Math.ceil(filteredListeners.length / listenersPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
{/* Modal for Adding New Listener */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Listener</h2>
      <label className="block mb-2 text-gray-800">Name:</label> {/* Darker text color */}
      <input
        type="text"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newListener.name}
        onChange={(e) => setNewListener({ ...newListener, name: e.target.value })}
      />
      <label className="block mb-2 text-gray-800">Specialties (comma separated):</label> {/* Darker text color */}
      <input
        type="text"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newListener.specialties?.join(', ')}
        onChange={(e) => setNewListener({ ...newListener, specialties: e.target.value.split(',').map(s => s.trim()) })}
      />
      <label className="block mb-2 text-gray-800">Languages (comma separated):</label> {/* Darker text color */}
      <input
        type="text"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newListener.languages?.join(', ')}
        onChange={(e) => setNewListener({ ...newListener, languages: e.target.value.split(',').map(lang => lang.trim()) })}
      />
      <label className="block mb-2 text-gray-800">Availability Status:</label> {/* Darker text color */}
      <select
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newListener.availabilityStatus}
        onChange={(e) => setNewListener({ ...newListener, availabilityStatus: e.target.value as 'available' | 'unavailable' })}
      >
        <option value="available">Available</option>
        <option value="unavailable">Unavailable</option>
      </select>
      <label className="block mb-2 text-gray-800">Sessions Conducted:</label> {/* Darker text color */}
      <input
        type="number"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newListener.sessionsConducted || ''}
        onChange={(e) => setNewListener({ ...newListener, sessionsConducted: Number(e.target.value) })}
      />
      <label className="block mb-2 text-gray-800">Average Rating:</label> {/* Darker text color */}
      <input
        type="number"
        className="border p-2 mb-4 w-full text-gray-800" // Darker text color
        value={newListener.averageRating || ''}
        onChange={(e) => setNewListener({ ...newListener, averageRating: Number(e.target.value) })}
      />
      <div className="flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleAddListener}>
          Add Listener
        </button>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Listeners;
