import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL } from '@/config/api';

interface RegisterProps {
  onSuccess: () => void;
}

type AlertType = 'success' | 'error' | null;

interface AlertMessage {
  type: AlertType;
  text: string;
}

export default function Register({ onSuccess }: RegisterProps) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage>({ type: null, text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const showAlert = (type: AlertType, text: string) => {
    setAlert({ type, text });
    // Clear alert after 5 seconds
    setTimeout(() => {
      setAlert({ type: null, text: '' });
    }, 5000);
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      showAlert('error', 'All fields are required');
      return false;
    }

    if (!formData.email.includes('@')) {
      showAlert('error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      showAlert('error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert('error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert({ type: null, text: '' });

    try {
      const response = await fetch(`${API_URL}/admin/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      showAlert('success', 'Registration successful!');
      onSuccess();
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const Alert = ({ type, text }: { type: AlertType; text: string }) => {
    if (!type || !text) return null;

    const alertClasses = {
      success: 'bg-green-100 text-green-700 border-green-400',
      error: 'bg-red-100 text-red-700 border-red-400',
    };

    return (
      <div className={`p-4 rounded-md border ${type ? alertClasses[type] : ''} mb-4`}>
        {text}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      
      <Alert type={alert.type} text={alert.text} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="text-gray-900 placeholder:text-gray-500"
            required
          />
          
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="text-gray-900 placeholder:text-gray-500 pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="text-gray-900 placeholder:text-gray-500 pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        By registering, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}