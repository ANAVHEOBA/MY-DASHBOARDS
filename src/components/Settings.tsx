import React, { useState, useEffect } from 'react';
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
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface AdminProfile {
  name: string;
  email: string;
}

interface Settings {
  twoFactorEnabled: boolean;
  notificationPrefs: boolean;
  sessionDuration: number;
  cancellationPolicy: string;
  googleMeetApiKey: string;
  backupEnabled: boolean;
  language: string;
  theme: string;
}

const Settings: React.FC = () => {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile and settings states
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settings, setSettings] = useState<Settings>({
    twoFactorEnabled: false,
    notificationPrefs: true,
    sessionDuration: 60,
    cancellationPolicy: '',
    googleMeetApiKey: '',
    backupEnabled: false,
    language: 'en',
    theme: 'light'
  });

  // UI states
  const [expandedSection, setExpandedSection] = useState<string | null>('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const sections: Section[] = [
    { 
      id: 'account', 
      title: 'Account Settings', 
      icon: <Lock className="h-5 w-5" />,
      description: 'Manage your account security and personal information'
    },
    { 
      id: 'system', 
      title: 'System Settings', 
      icon: <Bell className="h-5 w-5" />,
      description: 'Configure system-wide preferences and notifications'
    },
    { 
      id: 'integration', 
      title: 'Integration Settings', 
      icon: <Key className="h-5 w-5" />,
      description: 'Manage external service integrations and API keys'
    },
    { 
      id: 'backup', 
      title: 'Backup & Data', 
      icon: <Database className="h-5 w-5" />,
      description: 'Configure data backup and retention policies'
    },
    { 
      id: 'language', 
      title: 'Language Settings', 
      icon: <Globe className="h-5 w-5" />,
      description: 'Set your preferred language and regional settings'
    },
    { 
      id: 'theme', 
      title: 'Theme Customization', 
      icon: <Palette className="h-5 w-5" />,
      description: 'Customize the appearance of your dashboard'
    },
  ];


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        setAdminProfile({
          name: data.adminProfile.name,
          email: data.adminProfile.email
        });
        
        setSettings({
          twoFactorEnabled: data.twoFactorEnabled,
          notificationPrefs: data.notificationPrefs,
          sessionDuration: data.sessionDuration,
          cancellationPolicy: data.cancellationPolicy,
          googleMeetApiKey: data.googleMeetApiKey,
          backupEnabled: data.backupEnabled,
          language: data.language,
          theme: data.theme
        });

      } catch (error) {
        setError('Failed to load settings');
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/settings/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) throw new Error('Failed to update password');
      
      toast.success('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSection = async (section: string) => {
    try {
      setIsSaving(true);
      let endpoint = `/api/settings/${section}`;
      let data = {};

      switch (section) {
        case 'account':
          data = { adminProfile };
          break;
        case 'system':
          data = {
            notificationPrefs: settings.notificationPrefs,
            sessionDuration: settings.sessionDuration,
            cancellationPolicy: settings.cancellationPolicy
          };
          break;
        // Add other cases as needed
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to save ${section} settings`);
      
      toast.success(`${section} settings saved successfully`);
      setHasUnsavedChanges(false);
      
    } catch (error) {
      toast.error(`Failed to save ${section} settings`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };


  const renderSectionHeader = (section: Section) => (
    <button
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
      onClick={() => toggleSection(section.id)}
    >
      <div className="flex items-center space-x-3">
        {section.icon}
        <div>
          <span className="font-medium text-gray-800">{section.title}</span>
          <p className="text-sm text-gray-500">{section.description}</p>
        </div>
      </div>
      {expandedSection === section.id ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );

  const renderSaveButton = (section: string) => (
    <button
      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      onClick={() => handleSaveSection(section)}
      disabled={isSaving}
    >
      {isSaving ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      ) : (
        <Save className="h-4 w-4 mr-2" />
      )}
      Save Changes
    </button>
  );


  const renderAccountSection = () => (
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

      <div className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {password && (
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handlePasswordChange}
          >
            Update Password
          </button>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="2fa"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.twoFactorEnabled}
          onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
        />
        <label htmlFor="2fa" className="ml-2 block text-sm text-gray-700">
          Enable Two-Factor Authentication
        </label>
      </div>

      {renderSaveButton('account')}
    </div>
  );

  // Add similar render functions for other sections


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Settings</h2>
        {hasUnsavedChanges && (
          <div className="text-sm text-yellow-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Unsaved changes
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {renderSectionHeader(section)}
            {expandedSection === section.id && (
              <div className="p-4 border-t border-gray-200">
                {section.id === 'account' && renderAccountSection()}
                {/* Add other section content renders */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;