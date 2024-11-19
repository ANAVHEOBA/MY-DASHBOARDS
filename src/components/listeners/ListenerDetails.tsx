import React from 'react';
import { X } from 'lucide-react';
import { ListenerDetailsProps } from './types';

export const ListenerDetails: React.FC<ListenerDetailsProps> = ({
  listener,
  showDetails,
  onClose,
  getStatusColor,
  formatDuration
}) => {
  if (!listener) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform ${
      showDetails ? 'translate-x-0' : 'translate-x-full'
    } transition-transform duration-200 ease-in-out overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Listener Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Current Status</h4>
            <div className="mt-1 flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs ${
                getStatusColor(listener.availabilityStatus)
              }`}>
                {listener.availabilityStatus}
              </span>
            </div>
          </div>

          {/* Current Session */}
          {listener.currentSession && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Current Session</h4>
              <div className="mt-1 space-y-2">
                <p className="text-sm">User: {listener.currentSession.userName}</p>
                <p className="text-sm">Duration: {formatDuration(listener.currentSession.duration)}</p>
                <p className="text-sm">Started: {new Date(listener.currentSession.startTime).toLocaleTimeString()}</p>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Performance Metrics</h4>
            <div className="mt-1 space-y-2">
              <p className="text-sm">Satisfaction Score: {listener.performanceMetrics.satisfactionScore.toFixed(1)}</p>
              <p className="text-sm">Completion Rate: {listener.performanceMetrics.completionRate}%</p>
              <p className="text-sm">Avg Session Duration: {formatDuration(listener.performanceMetrics.averageSessionDuration)}</p>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Specialties</h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {listener.specialties.map((specialty: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};