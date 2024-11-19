import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Eye, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Shield,
  Users,
  Star,
  MessageSquare,
  X,
  BarChart2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Listener {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  availabilityStatus: 'online' | 'offline' | 'in-session';
  sessionsConducted: number;
  averageRating: number;
  currentSession?: {
    userId: string;
    userName: string;
    startTime: string;
    duration: number;
  };
  lastActive: string;
  responseRate: number;
  reportedIssues: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  performanceMetrics: {
    satisfactionScore: number;
    completionRate: number;
    averageSessionDuration: number;
  };
}

interface ListenerMetrics {
  totalActive: number;
  currentlyInSession: number;
  averageResponseTime: number;
  totalSessions: number;
  averageRating: number;
  totalReportedIssues: number;
}

const Listeners: React.FC = () => {
  // State management
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredListeners, setFilteredListeners] = useState<Listener[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listenersPerPage] = useState(10);
  const [selectedListener, setSelectedListener] = useState<Listener | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ListenerMetrics>({
    totalActive: 0,
    currentlyInSession: 0,
    averageResponseTime: 0,
    totalSessions: 0,
    averageRating: 0,
    totalReportedIssues: 0
  });

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/listeners/monitor');
        const data = await response.json() as Listener[];
        setListeners(data);

        // Calculate metrics
        const activeListeners = data.filter(listener => 
          listener.availabilityStatus !== 'offline'
        );
        const inSession = data.filter(listener => 
          listener.availabilityStatus === 'in-session'
        );
        
        setMetrics({
          totalActive: activeListeners.length,
          currentlyInSession: inSession.length,
          averageResponseTime: calculateAverageResponseTime(data),
          totalSessions: data.reduce((acc, listener) => acc + listener.sessionsConducted, 0),
          averageRating: calculateAverageRating(data),
          totalReportedIssues: data.reduce((acc, listener) => acc + listener.reportedIssues, 0)
        });

      } catch (error) {
        setError('Failed to fetch listener data');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListeners();
    const interval = setInterval(fetchListeners, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredListeners(
      listeners.filter(listener =>
        listener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listener.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, listeners]);


  const calculateAverageResponseTime = (listeners: Listener[]): number => {
    const totalResponseTime = listeners.reduce((acc, listener) => 
      acc + (listener.responseRate || 0), 0);
    return listeners.length ? totalResponseTime / listeners.length : 0;
  };

  const calculateAverageRating = (listeners: Listener[]): number => {
    const totalRating = listeners.reduce((acc, listener) => 
      acc + listener.averageRating, 0);
    return listeners.length ? totalRating / listeners.length : 0;
  };

  const getStatusColor = (status: Listener['availabilityStatus']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'in-session':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleListenerSelect = (listener: Listener) => {
    setSelectedListener(listener);
    setShowDetails(true);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const indexOfLastListener = currentPage * listenersPerPage;
  const indexOfFirstListener = indexOfLastListener - listenersPerPage;
  const currentListeners = filteredListeners.slice(indexOfFirstListener, indexOfLastListener);


  const renderMetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Listeners</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalActive}</div>
          <p className="text-xs text-gray-500">Currently online</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">In Session</CardTitle>
          <MessageSquare className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.currentlyInSession}</div>
          <p className="text-xs text-gray-500">Active sessions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageRating.toFixed(1)}</div>
          <p className="text-xs text-gray-500">Overall satisfaction</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageResponseTime}s</div>
          <p className="text-xs text-gray-500">Average response</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderListenerDetails = () => (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform ${
      showDetails ? 'translate-x-0' : 'translate-x-full'
    } transition-transform duration-200 ease-in-out overflow-y-auto`}>
      {selectedListener && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Listener Details</h3>
            <button 
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Current Status</h4>
              <div className="mt-1 flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  getStatusColor(selectedListener.availabilityStatus)
                }`}>
                  {selectedListener.availabilityStatus}
                </span>
              </div>
            </div>

            {selectedListener.currentSession && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Current Session</h4>
                <div className="mt-1 space-y-2">
                  <p className="text-sm">User: {selectedListener.currentSession.userName}</p>
                  <p className="text-sm">Duration: {formatDuration(selectedListener.currentSession.duration)}</p>
                  <p className="text-sm">Started: {new Date(selectedListener.currentSession.startTime).toLocaleTimeString()}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-500">Performance Metrics</h4>
              <div className="mt-1 space-y-2">
                <p className="text-sm">Satisfaction Score: {selectedListener.performanceMetrics.satisfactionScore.toFixed(1)}</p>
                <p className="text-sm">Completion Rate: {selectedListener.performanceMetrics.completionRate}%</p>
                <p className="text-sm">Avg Session Duration: {formatDuration(selectedListener.performanceMetrics.averageSessionDuration)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Specialties</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedListener.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Listener Monitoring</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
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

      {renderMetricsCards()}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search listeners by name or specialty..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listener
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentListeners.map(listener => (
                <tr key={listener.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{listener.name}</div>
                        <div className="text-sm text-gray-500">
                          {listener.specialties.slice(0, 2).join(', ')}
                          {listener.specialties.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatusColor(listener.availabilityStatus)
                    }`}>
                      {listener.availabilityStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {listener.currentSession ? (
                      <div>
                        <div>{listener.currentSession.userName}</div>
                        <div className="text-xs">{formatDuration(listener.currentSession.duration)}</div>
                      </div>
                    ) : (
                      'No active session'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{listener.averageRating.toFixed(1)} ⭐</div>
                    <div className="text-xs text-gray-500">{listener.sessionsConducted} sessions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleListenerSelect(listener)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {listener.reportedIssues > 0 && (
                      <button className="text-red-600 hover:text-red-900">
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: Math.ceil(filteredListeners.length / listenersPerPage) }, (_, i) => (
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

      {renderListenerDetails()}
    </div>
  );
};

export default Listeners;