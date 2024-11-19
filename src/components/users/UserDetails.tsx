import React from 'react';
import { X, Shield, Clock, Map, Activity, AlertTriangle, Smartphone } from 'lucide-react';
import { User } from '@/services/types';

interface UserDetailsProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  const detailSections = [
    {
      title: 'Account Information',
      items: [
        { label: 'Name', value: user.name, icon: Shield },
        { label: 'Email', value: user.email, icon: Shield },
        { label: 'Status', value: user.accountStatus, icon: Activity },
        { label: 'Verification', value: user.verificationStatus, icon: Shield }
      ]
    },
    {
      title: 'Activity Metrics',
      items: [
        { label: 'Total Sessions', value: user.totalSessions, icon: Activity },
        { label: 'Last Login', value: new Date(user.lastLoginDate).toLocaleString(), icon: Clock },
        { label: 'Login Attempts', value: user.loginAttempts, icon: AlertTriangle },
        { label: 'Reported Issues', value: user.reportedIssues, icon: AlertTriangle }
      ]
    },
    {
      title: 'Technical Details',
      items: [
        { label: 'Device Info', value: user.deviceInfo, icon: Smartphone },
        { label: 'Location', value: user.location, icon: Map }
      ]
    }
  ];

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-200 ease-in-out overflow-y-auto`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">User Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {detailSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">{section.title}</h4>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};