import React from 'react';
import { SessionMetrics } from './types';

interface MetricsCardsProps {
  metrics: SessionMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-500">Total Sessions</div>
      <div className="mt-1 text-2xl font-semibold">{metrics.totalSessions}</div>
    </div>
    
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-500">Unassigned</div>
      <div className="mt-1 text-2xl font-semibold text-yellow-600">
        {metrics.unassignedSessions}
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-500">In Progress</div>
      <div className="mt-1 text-2xl font-semibold text-green-600">
        {metrics.inProgressSessions}
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-500">Completed Today</div>
      <div className="mt-1 text-2xl font-semibold text-blue-600">
        {metrics.completedToday}
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-500">Avg. Wait Time</div>
      <div className="mt-1 text-2xl font-semibold">
        {Math.round(metrics.averageWaitTime)}m
      </div>
    </div>
  </div>
);