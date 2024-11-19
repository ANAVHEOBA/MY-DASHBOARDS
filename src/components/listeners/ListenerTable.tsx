import React from 'react';
import { Eye, AlertTriangle } from 'lucide-react';
import { ListenerTableProps } from './types';

export const ListenerTable: React.FC<ListenerTableProps> = ({
  listeners,
  onListenerSelect,
  getStatusColor,
  formatDuration
}) => {
  return (
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
            {listeners.map(listener => (
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
                    onClick={() => onListenerSelect(listener)}
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
  );
};