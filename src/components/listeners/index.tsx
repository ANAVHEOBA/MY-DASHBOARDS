import React from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListeners } from '@/hooks/useLIsteners';
import { MetricsCards } from './MetricsCards';
import { ListenerTable } from './ListenerTable';
import { ListenerDetails } from './ListenerDetails';
import { getStatusColor, formatDuration } from '@/lib/utils';

const Listeners: React.FC = () => {
  const {
    listeners,
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
    closeDetails
  } = useListeners();

  if (loading) {
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
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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

      <MetricsCards metrics={metrics} />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search listeners by name or specialty..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <ListenerTable
        listeners={listeners}
        onListenerSelect={handleListenerSelect}
        getStatusColor={getStatusColor}
        formatDuration={formatDuration}
      />

      <ListenerDetails
        listener={selectedListener}
        showDetails={showDetails}
        onClose={closeDetails}
        getStatusColor={getStatusColor}
        formatDuration={formatDuration}
      />
    </div>
  );
};

export default Listeners;