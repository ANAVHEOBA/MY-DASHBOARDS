// Analytics.tsx
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
      const response = await fetch(`/api/analytics?start=${startDate}&end=${endDate}`);
      if (!response.ok) {
        console.error("Failed to fetch analytics data");
        setLoading(false);
        return;
      }
      const data: AnalyticsData = await response.json();
      setAnalyticsData(data);
      setLoading(false);
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Analytics</h2>

      <div className="mb-4">
        <label className="mr-2 text-gray-800">Start Date:</label>
        <input
          type="date"
          className="border p-2 text-gray-800"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className="mr-2 ml-4 text-gray-800">End Date:</label>
        <input
          type="date"
          className="border p-2 text-gray-800"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-gray-800">Loading analytics data...</div>
      ) : (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">User Analytics</h3>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p>New User Registrations: {analyticsData?.userRegistrations}</p>
            <p>User Retention Rate: {analyticsData?.userRetention}%</p>
            <p>User Engagement Metrics: {analyticsData?.userEngagement}</p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Listener Analytics</h3>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p>Listener Performance Metrics: {analyticsData?.listenerPerformance}</p>
            <p>Availability vs. Utilization Rates: {analyticsData?.utilizationRate}%</p>
            <p>Listener Ratings Over Time: {analyticsData?.listenerRatings}</p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Session Analytics</h3>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p>Number of Sessions: {analyticsData?.totalSessions}</p>
            <p>Average Session Duration: {analyticsData?.averageSessionDuration} minutes</p>
            <p>Session Cancellation Rates: {analyticsData?.cancellationRate}%</p>
            <p>Peak Usage Times: {analyticsData?.peakUsage}</p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Platform Performance Metrics</h3>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p>System Uptime: {analyticsData?.systemUptime}%</p>
            <p>Average Response Times: {analyticsData?.averageResponseTime} ms</p>
            <p>Error Rates: {analyticsData?.errorRate}%</p>
          </div>

          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => handleExport('CSV')}
            >
              Export as CSV
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleExport('PDF')}
            >
              Export as PDF
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Report Builder</h3>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p>Implement your custom report builder here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
