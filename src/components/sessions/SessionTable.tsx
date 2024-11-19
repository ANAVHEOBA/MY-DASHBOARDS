import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import { Session } from './types';

interface SessionTableProps {
  sessions: Session[];
  onAssignClick: (session: Session) => void;
  onViewClick: (session: Session) => void;
}

export const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  onAssignClick,
  onViewClick
}) => {
  const getStatusColor = (status: Session['status']) => {
    const colors = {
      'unassigned': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getPriorityBadge = (priority: Session['priority']) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date/Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listener
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sessions.map((session) => (
            <tr key={session.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(session.dateTime).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(session.dateTime).toLocaleTimeString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {session.userName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getPriorityBadge(session.priority)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {session.listenerName || (
                  <button
                    onClick={() => onAssignClick(session)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Assign Listener
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onViewClick(session)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Eye className="h-5 w-5" />
                </button>
                {session.status === 'unassigned' && (
                  <button
                    onClick={() => onAssignClick(session)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};