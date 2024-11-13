import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye, Edit2, XCircle, X } from 'lucide-react';

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
  const [listenersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [newListener, setNewListener] = useState<Partial<Listener>>({
    name: '',
    specialties: [],
    languages: [],
    availabilityStatus: 'available',
    sessionsConducted: 0,
    averageRating: 0,
  });


  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const response = await fetch('/api/listeners');
        const data = await response.json();
        setListeners(data);
      } catch (error) {
        console.error('Error fetching listeners:', error);
        // Handle error appropriately
      }
    };

    fetchListeners();
  }, []);

  useEffect(() => {
    const filtered = listeners.filter(listener =>
      listener.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListeners(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, listeners]);

  const handleAddListener = () => {
    if (!newListener.name) {
      alert('Name is required');
      return;
    }

    const newListenerData: Listener = {
      ...newListener,
      id: `L${Date.now()}`, // Generate a timestamp-based ID
      specialties: newListener.specialties || [],
      languages: newListener.languages || [],
      sessionsConducted: newListener.sessionsConducted || 0,
      averageRating: newListener.averageRating || 0,
    } as Listener;

    setListeners(prev => [...prev, newListenerData]);
    setShowModal(false);
    setNewListener({
      name: '',
      specialties: [],
      languages: [],
      availabilityStatus: 'available',
      sessionsConducted: 0,
      averageRating: 0,
    });
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate current listeners for pagination
  const indexOfLastListener = currentPage * listenersPerPage;
  const indexOfFirstListener = indexOfLastListener - listenersPerPage;
  const currentListeners = filteredListeners.slice(indexOfFirstListener, indexOfLastListener);

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header Section */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Listeners</h2>
      
      {/* Search and Add Section */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search Listeners..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New Listener</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>


          <tbody className="bg-white divide-y divide-gray-200">
            {currentListeners.map(listener => (
              <tr key={listener.id} className="hover:bg-gray-50">
                <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-800">{listener.id}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{listener.name}</td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-800">{listener.specialties.join(', ')}</td>
                <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-800">{listener.languages.join(', ')}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    listener.availabilityStatus === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {listener.availabilityStatus}
                  </span>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-800">{listener.sessionsConducted}</td>
                <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-800">{listener.averageRating.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-yellow-500 hover:text-yellow-700">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <XCircle className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
        {Array.from({ length: Math.ceil(filteredListeners.length / listenersPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Add New Listener</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  value={newListener.name}
                  onChange={(e) => setNewListener({ ...newListener, name: e.target.value })}
                />
              </div>

              {/* Specialties Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  value={newListener.specialties?.join(', ')}
                  onChange={(e) => setNewListener({ 
                    ...newListener, 
                    specialties: e.target.value.split(',').map(s => s.trim()) 
                  })}
                />
              </div>

              {/* Languages Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  value={newListener.languages?.join(', ')}
                  onChange={(e) => setNewListener({ 
                    ...newListener, 
                    languages: e.target.value.split(',').map(s => s.trim()) 
                  })}
                />
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  value={newListener.availabilityStatus}
                  onChange={(e) => setNewListener({ 
                    ...newListener, 
                    availabilityStatus: e.target.value as 'available' | 'unavailable' 
                  })}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleAddListener}
                >
                  Add Listener
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listeners;