import React, { useEffect, useState } from 'react';

// Define the structure of the analytics data
interface AnalyticsData {
  userRegistrations: number;
  userRetention: number;
  userEngagement: number;
  listenerPerformance: number;
  utilizationRate: number;
  listenerRatings: number;
  totalSessions: number;
  averageSessionDuration: number;
  cancellationRate: number;
  peakUsage: string;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
}

const Analytics: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?start=${startDate}&end=${endDate}`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data: AnalyticsData = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchAnalyticsData();
    }
  }, [startDate, endDate]);

  const handleExport = (format: string) => {
    // Implement the export logic based on the selected format
    console.log(`Exporting analytics data as ${format}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-6">
      {/* Header Section */}
      <header className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        
        {/* Date Range Selector */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Start Date:</label>
            <input
              type="date"
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading analytics data...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Analytics Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">User Analytics</h3>
                <div className="space-y-3 text-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">New Registrations</span>
                    <span className="font-medium">{analyticsData?.userRegistrations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Retention Rate</span>
                    <span className="font-medium">{analyticsData?.userRetention}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Engagement Score</span>
                    <span className="font-medium">{analyticsData?.userEngagement}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Listener Analytics Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Listener Analytics</h3>
                <div className="space-y-3 text-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Performance Score</span>
                    <span className="font-medium">{analyticsData?.listenerPerformance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Utilization Rate</span>
                    <span className="font-medium">{analyticsData?.utilizationRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Average Rating</span>
                    <span className="font-medium">{analyticsData?.listenerRatings}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Analytics Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Session Analytics</h3>
                <div className="space-y-3 text-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Total Sessions</span>
                    <span className="font-medium">{analyticsData?.totalSessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Avg Duration</span>
                    <span className="font-medium">{analyticsData?.averageSessionDuration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Cancellation Rate</span>
                    <span className="font-medium">{analyticsData?.cancellationRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Peak Usage</span>
                    <span className="font-medium">{analyticsData?.peakUsage}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Performance Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Platform Performance</h3>
                <div className="space-y-3 text-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">System Uptime</span>
                    <span className="font-medium">{analyticsData?.systemUptime}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Response Time</span>
                    <span className="font-medium">{analyticsData?.averageResponseTime} ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">Error Rate</span>
                    <span className="font-medium">{analyticsData?.errorRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => handleExport('CSV')}
            >
              Export as CSV
            </button>
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => handleExport('PDF')}
            >
              Export as PDF
            </button>
          </div>

          {/* Custom Report Builder */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm sm:text-base text-gray-600">
                  Implement your custom report builder interface here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;