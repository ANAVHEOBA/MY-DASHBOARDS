import { useState, useEffect, useCallback, useMemo } from 'react';
import { listenerApi } from '@/services/api';
import { Listener, ListenerMetrics } from '@/services/types';

export const useListeners = () => {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedListener, setSelectedListener] = useState<Listener | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ListenerMetrics>({
    totalActive: 0,
    currentlyInSession: 0,
    averageResponseTime: 0,
    totalSessions: 0,
    averageRating: 0,
    totalReportedIssues: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [listenersData, metricsData] = await Promise.all([
        listenerApi.getListeners({ timeRange }),
        listenerApi.getMetrics(timeRange)
      ]);
      
      setListeners(listenersData);
      setMetrics(metricsData);
    } catch (err) {
      setError('Failed to fetch listener data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleListenerSelect = (listener: Listener) => {
    setSelectedListener(listener);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedListener(null);
  };

  const filteredListeners = useMemo(() => {
    return listeners.filter(listener =>
      listener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listener.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [listeners, searchTerm]);

  return {
    listeners: filteredListeners,
    metrics,
    loading,
    error,
    searchTerm,
    timeRange,
    currentPage,
    selectedListener,
    showDetails,
    setCurrentPage,
    handleTimeRangeChange,
    handleSearch,
    handleListenerSelect,
    closeDetails,
    refreshData: fetchData
  };
};