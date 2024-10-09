// Settings.tsx
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(60); // minutes
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [googleMeetApiKey, setGoogleMeetApiKey] = useState('');
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    console.log('Profile saved:', adminProfile);
    // Implement API call to save profile
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
    // Implement API call to save settings
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Settings</h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Account Settings</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <label className="block mb-2 text-gray-800">Admin Name:</label>
          <input
            type="text"
            name="name"
            className="border p-2 text-gray-800 w-full"
            value={adminProfile.name}
            onChange={handleProfileChange}
          />

          <label className="block mb-2 mt-4 text-gray-800">Admin Email:</label>
          <input
            type="email"
            name="email"
            className="border p-2 text-gray-800 w-full"
            value={adminProfile.email}
            onChange={handleProfileChange}
          />

          <label className="block mb-2 mt-4 text-gray-800">New Password:</label>
          <input
            type="password"
            className="border p-2 text-gray-800 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block mb-2 mt-4 text-gray-800">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            />{' '}
            Enable Two-Factor Authentication
          </label>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleSaveProfile}
          >
            Save Profile
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">System Settings</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <label className="block mb-2 text-gray-800">
            <input
              type="checkbox"
              checked={notificationPrefs}
              onChange={() => setNotificationPrefs(!notificationPrefs)}
            />{' '}
            Email Notification Preferences
          </label>

          <label className="block mb-2 mt-4 text-gray-800">Session Duration (minutes):</label>
          <input
            type="number"
            className="border p-2 text-gray-800 w-full"
            value={sessionDuration}
            onChange={(e) => setSessionDuration(Number(e.target.value))}
          />

          <label className="block mb-2 mt-4 text-gray-800">Cancellation Policy:</label>
          <textarea
            className="border p-2 text-gray-800 w-full"
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Integration Settings</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <label className="block mb-2 text-gray-800">Google Meet API Key:</label>
          <input
            type="text"
            className="border p-2 text-gray-800 w-full"
            value={googleMeetApiKey}
            onChange={(e) => setGoogleMeetApiKey(e.target.value)}
          />

          <label className="block mb-2 mt-4 text-gray-800">
            <input
              type="checkbox"
              checked={backupEnabled}
              onChange={() => setBackupEnabled(!backupEnabled)}
            />{' '}
            Enable Backup Options
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">User Agreement and Privacy Policy</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-gray-800">Implement user agreement and privacy policy editor here.</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Role and Permission Management</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-gray-800">Manage roles and permissions for admin accounts here.</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Language and Localization Settings</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <label className="block mb-2 text-gray-800">Language:</label>
          <select
            className="border p-2 text-gray-800 w-full"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            {/* Add more language options here */}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Theme and Branding Customization</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <label className="block mb-2 text-gray-800">Theme:</label>
          <select
            className="border p-2 text-gray-800 w-full"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleSaveSettings}
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
