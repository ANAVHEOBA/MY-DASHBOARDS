import { getAuthToken } from './auth';

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const handleUnauthorized = (error: any) => {
  if (error.status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = '/auth';
  }
  return error;
};