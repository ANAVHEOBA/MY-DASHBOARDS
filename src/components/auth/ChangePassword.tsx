import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const API_URI = 'https://ready-back-end.onrender.com';

interface ChangePasswordProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ChangePassword({ onSuccess, onCancel }: ChangePasswordProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URI}/admin/change-password`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md border border-red-400">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <Input
          type="password"
          placeholder="New Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="text-gray-900 placeholder:text-gray-500"
          required
          minLength={6}
        />
        
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="text-gray-900 placeholder:text-gray-500"
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
          onClick={onCancel} 
          variant="outline" 
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}