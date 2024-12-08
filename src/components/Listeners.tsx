import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye, Edit2, XCircle, X, RefreshCw, MessageCircle } from 'lucide-react';
import { Listener, FormErrors, TimeSlot, DayAvailability, Message } from '../types/listener';
import { DAYS_OF_WEEK, DEFAULT_TIME_SLOTS, GENDERS } from '../constants/listener';

const API_URL = 'https://ready-back-end.onrender.com';

const Listeners: React.FC = () => {
  // State Management
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredListeners, setFilteredListeners] = useState<Listener[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listenersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListener, setSelectedListener] = useState<Listener | null>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messagePriority, setMessagePriority] = useState<'normal' | 'urgent'>('normal');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Initialize new listener state
  const [newListener, setNewListener] = useState<Listener>({
    name: '',
    description: '',
    gender: 'male',
    email: '', 
    phoneNumber: '', 
    availability: DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day,
      times: day === 'saturday' || day === 'sunday'
        ? DEFAULT_TIME_SLOTS.weekend.map(slot => ({
            ...slot,
            isAvailable: true
          }))
        : DEFAULT_TIME_SLOTS.weekday.map(slot => ({
            ...slot,
            isAvailable: true
          }))
    }))
  });


  // Fetch Listeners
useEffect(() => {
  const fetchListeners = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/listeners`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch listeners');
      }

      const listenersArray = Array.isArray(data) ? data : data.listeners || [];
      setListeners(listenersArray);
      setFilteredListeners(listenersArray);
      setError(null);
    } catch (error) {
      console.error('Error fetching listeners:', error);
      setError('Failed to fetch listeners');
      setListeners([]);
      setFilteredListeners([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchListeners();
}, []);

// Refresh function
const refreshListeners = async () => {
  try {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/listeners`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to refresh listeners');
    }

    const listenersArray = Array.isArray(data) ? data : data.listeners || [];
    setListeners(listenersArray);
    setFilteredListeners(listenersArray);
    setError(null);
  } catch (error) {
    console.error('Error refreshing listeners:', error);
    setError('Failed to refresh listeners');
    setListeners([]);
    setFilteredListeners([]);
  } finally {
    setIsLoading(false);
  }
};

const fetchListenerDetails = async (listenerId: string) => {
  try {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/listeners/${listenerId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch listener details');
    }

    setSelectedListener(data.listener);
    setShowDetailsModal(true);
  } catch (error) {
    console.error('Error fetching listener details:', error);
    alert('Failed to fetch listener details. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const fetchMessagesForListener = async (listenerId?: string) => {
  if (!listenerId) {
    console.error('No listener ID provided');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/listeners/${listenerId}/messages`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch messages');
    }

    setMessages(data.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    alert('Failed to fetch messages. Please try again.');
  }
};

const sendMessageToListener = async () => {
  if (!selectedListener) return;

  try {
    const response = await fetch(`${API_URL}/listeners/${selectedListener._id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: messageSubject,
        content: messageContent,
        priority: messagePriority,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    alert('Message sent successfully!');
    setMessageSubject('');
    setMessageContent('');
    setMessagePriority('normal');
    setShowMessageModal(false);
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message. Please try again.');
  }
};


// Filter Listeners
useEffect(() => {
  if (!Array.isArray(listeners)) {
    setFilteredListeners([]);
    return;
  }

  const filtered = listeners.filter(listener => {
    if (!listener) return false;
    const searchTermLower = searchTerm.toLowerCase();
    return listener.name?.toLowerCase()?.includes(searchTermLower) || false;
  });

  setFilteredListeners(filtered);
  setCurrentPage(1);
}, [searchTerm, listeners]);

// Form validation
const validateForm = (): boolean => {
  const errors: FormErrors = {};
  let isValid = true;

  if (!newListener.name?.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }

  if (!newListener.description?.trim()) {
    errors.description = 'Description is required';
    isValid = false;
  }

  if (!newListener.gender) {
    errors.gender = 'Gender is required';
    isValid = false;
  }

  if (!newListener.email?.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(newListener.email)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }

  if (!newListener.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
    isValid = false;
  } else if (!/^\d{10}$/.test(newListener.phoneNumber)) {
    errors.phoneNumber = 'Phone number is invalid';
    isValid = false;
  }

  const hasInvalidTimes = newListener.availability.some(day => 
    day.times.some(time => !time.startTime || !time.endTime)
  );

  if (hasInvalidTimes) {
    errors.availability = 'All time slots must have start and end times';
    isValid = false;
  }

  setFormErrors(errors);
  return isValid;
};

// Handle form submission
const handleAddListener = async () => {
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  try {
    const listenerData = {
      name: newListener.name,
      description: newListener.description,
      gender: newListener.gender,
      email: newListener.email,
      phoneNumber: newListener.phoneNumber,
      availability: newListener.availability.map(day => ({
        dayOfWeek: day.dayOfWeek,
        times: day.times.map(time => ({
          startTime: time.startTime,
          endTime: time.endTime,
          isAvailable: true
        }))
      }))
    };

    const response = await fetch(`${API_URL}/listeners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listenerData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create listener');
    }

    await refreshListeners();
    setShowModal(false);
    resetForm();
    alert('Listener created successfully!');
  } catch (error) {
    console.error('Error creating listener:', error);
    alert('Failed to create listener. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

// Reset form
const resetForm = () => {
  setNewListener({
    name: '',
    description: '',
    gender: 'male',
    email: '',
    phoneNumber: '',
    availability: DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day,
      times: day === 'saturday' || day === 'sunday'
        ? DEFAULT_TIME_SLOTS.weekend.map(slot => ({
            ...slot,
            isAvailable: true
          }))
        : DEFAULT_TIME_SLOTS.weekday.map(slot => ({
            ...slot,
            isAvailable: true
          }))
    }))
  });
  setFormErrors({});
};

// Handle form input changes
const handleInputChange = (field: keyof Listener, value: any) => {
  setNewListener(prev => ({
    ...prev,
    [field]: value
  }));
};

// Handle time slot changes
const handleTimeSlotChange = (
  dayOfWeek: string, 
  index: number, 
  field: keyof TimeSlot, 
  value: string
) => {
  setNewListener(prev => ({
    ...prev,
    availability: prev.availability.map(day => {
      if (day.dayOfWeek === dayOfWeek) {
        const newTimes = [...day.times];
        newTimes[index] = {
          ...newTimes[index],
          [field]: value,
          isAvailable: true
        };
        return { ...day, times: newTimes };
      }
      return day;
    })
  }));
};

// Add new time slot to a day
const addTimeSlot = (dayOfWeek: string) => {
  setNewListener(prev => ({
    ...prev,
    availability: prev.availability.map(day => {
      if (day.dayOfWeek === dayOfWeek) {
        return {
          ...day,
          times: [...day.times, { 
            startTime: '09:00', 
            endTime: '17:00',
            isAvailable: true 
          }]
        };
      }
      return day;
    })
  }));
};

// Remove time slot from a day
const removeTimeSlot = (dayOfWeek: string, index: number) => {
  setNewListener(prev => ({
    ...prev,
    availability: prev.availability.map(day => {
      if (day.dayOfWeek === dayOfWeek) {
        const newTimes = day.times.filter((_, i) => i !== index);
        return { ...day, times: newTimes };
      }
      return day;
    })
  }));
};

// Pagination
const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
const indexOfLastListener = currentPage * listenersPerPage;
const indexOfFirstListener = indexOfLastListener - listenersPerPage;
const currentListeners = Array.isArray(filteredListeners) 
  ? filteredListeners.slice(indexOfFirstListener, indexOfLastListener)
  : [];


  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Listeners</h2>
        <div className="flex space-x-2">
          <button 
            className="flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={refreshListeners}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add New Listener</span>
          </button>
        </div>
      </div>
  
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
  
      {/* Loading and Error States */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <>
          {/* Listeners Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentListeners.length > 0 ? (
                  currentListeners.map((listener) => (
                    <tr key={listener._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{listener.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{listener.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">{listener.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              if (listener._id) {
                                fetchListenerDetails(listener._id);
                                fetchMessagesForListener(listener._id);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-yellow-500 hover:text-yellow-700">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-green-500 hover:text-green-700"
                            onClick={() => {
                              setSelectedListener(listener);
                              setShowMessageModal(true);
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No listeners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  
          {/* Pagination */}
          {currentListeners.length > 0 && (
            <div className="mt-4 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: Math.ceil(filteredListeners.length / listenersPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
  
      {/* Details Modal */}
      {selectedListener && showDetailsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Listener Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Name:</label>
                    <p>{selectedListener.name}</p>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Description:</label>
                    <p>{selectedListener.description}</p>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Gender:</label>
                    <p className="capitalize">{selectedListener.gender}</p>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Email:</label>
                    <p>{selectedListener.email}</p>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Phone:</label>
                    <p>{selectedListener.phoneNumber}</p>
                  </div>
  
                  <div>
                    <label className="font-medium text-gray-700">Availability:</label>
                    <div className="mt-2 space-y-2">
                      {selectedListener.availability.map((day) => (
                        <div key={day.dayOfWeek} className="border rounded p-2">
                          <p className="font-medium capitalize">{day.dayOfWeek}</p>
                          <div className="space-y-1 mt-1">
                            {day.times.map((time, index) => (
                              <p key={index} className="text-sm">
                                {time.startTime} - {time.endTime}
                                {time.isAvailable ? ' (Available)' : ' (Unavailable)'}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedListener(null);
                    setShowDetailsModal(false);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 
                    bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Add/Edit Modal */}
      {/* Add/Edit Modal */}
{showModal && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name*</label>
              <input
                type="text"
                value={newListener.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 text-gray-900 font-medium
                  ${formErrors.name ? 'border-red-300' : 'border-gray-300'}
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description*</label>
              <textarea
                value={newListener.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 text-gray-900 font-medium
                  ${formErrors.description ? 'border-red-300' : 'border-gray-300'}
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.description && (
                <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>
              )}
            </div>

            {/* Gender Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender*</label>
              <select
                value={newListener.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 font-medium
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender} className="font-medium">
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email*</label>
              <input
                type="email"
                value={newListener.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 text-gray-900 font-medium
                  ${formErrors.email ? 'border-red-300' : 'border-gray-300'}
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
              <input
                type="text"
                value={newListener.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 text-gray-900 font-medium
                  ${formErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'}
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">{formErrors.phoneNumber}</p>
              )}
            </div>

            {/* Availability Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability*
              </label>
              <div className="space-y-4">
                {newListener.availability.map((day) => (
                  <div key={day.dayOfWeek} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{day.dayOfWeek}</h4>
                      <button
                        type="button"
                        onClick={() => addTimeSlot(day.dayOfWeek)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Add Time Slot
                      </button>
                    </div>
                    <div className="space-y-2">
                      {day.times.map((time, timeIndex) => (
                        <div key={timeIndex} className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={time.startTime}
                            onChange={(e) => handleTimeSlotChange(
                              day.dayOfWeek,
                              timeIndex,
                              'startTime',
                              e.target.value
                            )}
                            className="rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 font-medium
                              focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-gray-900 font-medium">to</span>
                          <input
                            type="time"
                            value={time.endTime}
                            onChange={(e) => handleTimeSlotChange(
                              day.dayOfWeek,
                              timeIndex,
                              'endTime',
                              e.target.value
                            )}
                            className="rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 font-medium
                              focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          {day.times.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(day.dayOfWeek, timeIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {formErrors.availability && (
                <p className="mt-1 text-xs text-red-600">{formErrors.availability}</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleAddListener}
            disabled={isSubmitting}
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
              bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Listener'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 
              bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
  
      {/* Message Modal */}
      {/* Message Modal */}
{selectedListener && showMessageModal && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="space-y-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Send Message to {selectedListener.name}
            </h3>

            {/* Subject Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 font-medium 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 font-medium 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={messagePriority}
                onChange={(e) => setMessagePriority(e.target.value as 'normal' | 'urgent')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 font-medium 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Messages List */}
            {messages.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Previous Messages</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {messages.map((message: Message) => (
                    <div key={message._id} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">{message.subject}</h5>
                        <span className={`text-xs px-2 py-1 rounded ${
                          message.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {message.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={sendMessageToListener}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
              bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Send Message
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMessageModal(false);
              setSelectedListener(null);
              setMessageSubject('');
              setMessageContent('');
              setMessagePriority('normal');
            }}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 
              bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
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