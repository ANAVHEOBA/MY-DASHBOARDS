import React, { useState } from 'react';
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
  const [password, setPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [googleMeetApiKey, setGoogleMeetApiKey] = useState('');
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  
  // State for collapsible sections
  const [expandedSection, setExpandedSection] = useState<string | null>('account');

  const sections: Section[] = [
    { id: 'account', title: 'Account Settings', icon: <Lock className="h-5 w-5" /> },
    { id: 'system', title: 'System Settings', icon: <Bell className="h-5 w-5" /> },
    { id: 'integration', title: 'Integration Settings', icon: <Key className="h-5 w-5" /> },
    { id: 'agreement', title: 'User Agreement', icon: <FileText className="h-5 w-5" /> },
    { id: 'roles', title: 'Role Management', icon: <Users className="h-5 w-5" /> },
    { id: 'language', title: 'Language Settings', icon: <Globe className="h-5 w-5" /> },
    { id: 'theme', title: 'Theme Customization', icon: <Palette className="h-5 w-5" /> },
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    console.log('Profile saved:', adminProfile);
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', {
      password,
      twoFactorEnabled,
      notificationPrefs,
      sessionDuration,
      cancellationPolicy,
      googleMeetApiKey,
      backupEnabled,
      language,
      theme,
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Settings</h2>

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
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={adminProfile.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={adminProfile.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Policy
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Integration Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Similar structure for other sections */}
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
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleSaveSettings}
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;