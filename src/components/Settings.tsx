import React, { useState, useEffect } from 'react';
import { getAuthHeaders, handleUnauthorized } from '../utils/api';
import { 
  Save, 
  Lock, 
  Bell, 
  Clock, 
  FileText, 
  Key, 
  Database,
  Globe,
  Users,
  Palette,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const API_URI = 'https://ready-back-end.onrender.com';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const Settings: React.FC = () => {
  // State management
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [googleMeetApiKey, setGoogleMeetApiKey] = useState('');
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [expandedSection, setExpandedSection] = useState<string | null>('account');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  // Fetch admin profile on component mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch(`${API_URI}/admin/profile`, {
          headers: getAuthHeaders()
        });

        if (response.status === 401) {
                return handleUnauthorized(response);
              }

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setAdminProfile(data);
      } catch (error) {
        showAlert('error', 'Failed to load profile');
      }
    };

    fetchAdminProfile();
  }, []);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: null, message: '' });
    }, 5000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      showAlert('error', 'New passwords do not match');
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      showAlert('error', 'New password must be at least 6 characters long');
      return;
    }

    if (!passwordFormData.oldPassword) {
      showAlert('error', 'Please enter your current password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URI}/admin/change-password`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          oldPassword: passwordFormData.oldPassword,
          newPassword: passwordFormData.newPassword
        }),
      });

      if (response.status === 401) {
              return handleUnauthorized(response);
            }
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      showAlert('success', 'Password changed successfully');
      setShowChangePassword(false);
      setPasswordFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_URI}/admin/profile`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(adminProfile),
      });

      if (response.status === 401) {
              return handleUnauthorized(response);
            }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      showAlert('success', 'Profile updated successfully');
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const settings = {
        twoFactorEnabled,
        notificationPrefs,
        sessionDuration,
        cancellationPolicy,
        googleMeetApiKey,
        backupEnabled,
        language,
        theme,
      };

      const response = await fetch(`${API_URI}/admin/settings`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });

      if (response.status === 401) {
              return handleUnauthorized(response);
            }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      showAlert('success', 'Settings updated successfully');
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  const renderPasswordChangeForm = () => (
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <Input
          type="password"
          value={passwordFormData.oldPassword}
          onChange={(e) => setPasswordFormData({ 
            ...passwordFormData, 
            oldPassword: e.target.value 
          })}
          placeholder="Enter your current password"
          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <Input
          type="password"
          value={passwordFormData.newPassword}
          onChange={(e) => setPasswordFormData({ 
            ...passwordFormData, 
            newPassword: e.target.value 
          })}
          placeholder="Enter new password"
          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <Input
          type="password"
          value={passwordFormData.confirmPassword}
          onChange={(e) => setPasswordFormData({ 
            ...passwordFormData, 
            confirmPassword: e.target.value 
          })}
          placeholder="Confirm new password"
          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          required
          minLength={6}
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
        <Button 
          type="button" 
          onClick={() => {
            setShowChangePassword(false);
            setPasswordFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
          }}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );



  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Settings</h2>

      {alert.type && (
        <div className={`mb-6 p-4 rounded-md ${
          alert.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-400' 
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {alert.message}
        </div>
      )}

      <div className="space-y-4">
        {/* Account Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleSection('account')}
          >
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-800">Account Settings</span>
            </div>
            {expandedSection === 'account' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSection === 'account' && (
            <div className="p-4 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={adminProfile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter admin name"
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={adminProfile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter admin email"
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Change Password Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                {showChangePassword ? (
                  renderPasswordChangeForm()
                ) : (
                  <Button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Change Password
                  </Button>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="2fa"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                />
                <label htmlFor="2fa" className="ml-2 block text-sm text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          )}
        </div>

        {/* System Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleSection('system')}
          >
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-800">System Settings</span>
            </div>
            {expandedSection === 'system' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSection === 'system' && (
            <div className="p-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={notificationPrefs}
                  onChange={() => setNotificationPrefs(!notificationPrefs)}
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                  Email Notification Preferences
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  min={1}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Policy
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300 text-gray-900"
                  rows={4}
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Language Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleSection('language')}
          >
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-800">Language Settings</span>
            </div>
            {expandedSection === 'language' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSection === 'language' && (
            <div className="p-4 border-t border-gray-200">
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300 text-gray-900"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          )}
        </div>

        {/* Theme Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleSection('theme')}
          >
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-800">Theme Settings</span>
            </div>
            {expandedSection === 'theme' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSection === 'theme' && (
            <div className="p-4 border-t border-gray-200">
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300 text-gray-900"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
  