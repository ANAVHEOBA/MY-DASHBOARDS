import React from 'react';
import { Session, Listener } from './types';

interface AssignModalProps {
  session: Session | null;
  listeners: Listener[];
  onAssign: (sessionId: string, listenerId: string) => void;
  onClose: () => void;
}

export const AssignModal: React.FC<AssignModalProps> = ({
  session,
  listeners,
  onAssign,
  onClose
}) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Assign Listener
            </h3>
            
            <div className="mt-2">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Session Details</h4>
                <p className="text-sm text-gray-900">User: {session.userName}</p>
                <p className="text-sm text-gray-900">
                  Time: {new Date(session.dateTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-900">
                  Languages: {session.preferredLanguages.join(', ')}
                </p>
                {session.specialtyRequirements && (
                  <p className="text-sm text-gray-900">
                    Specialties: {session.specialtyRequirements.join(', ')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {listeners.map(listener => (
                  <button
                    key={listener.id}
                    onClick={() => onAssign(session.id, listener.id)}
                    className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium">{listener.name}</div>
                    <div className="text-sm text-gray-500">
                      Languages: {listener.languages.join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Specialties: {listener.specialties.join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Current Load: {listener.currentLoad} sessions
                    </div>
                    <div className={`text-sm ${
                      listener.availability === 'available' ? 'text-green-500' :
                      listener.availability === 'busy' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      Status: {listener.availability}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};