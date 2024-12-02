import { Listener, ApiResponse } from '../types/listener';
// Remove the import of API_URL
// import { API_URL } from '../config/api';
import { fetchWithRetry } from '../lib/utils';

const API_URL = 'https://ready-back-end.onrender.com'; 

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const listenerService = {
  createListener: async (listenerData: Partial<Listener>): Promise<ApiResponse> => {
    try {
      console.log('Making request to:', `${API_URL}/listeners`);
      
      const response = await fetch(`${API_URL}/listeners`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(listenerData),
        mode: 'cors', // Add this
        credentials: 'same-origin', // or 'include' if you need cookies
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  },

  getListeners: async (): Promise<Listener[]> => {
    try {
      const response = await fetch(`${API_URL}/listeners`, {
        method: 'GET',
        headers: defaultHeaders,
        mode: 'cors', // Add this
        credentials: 'same-origin', // or 'include' if you need cookies
      });
      
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('GET Listeners Response:', data);
  
      if (data.listeners) {
        return data.listeners;
      } else if (data.listener) {
        return [data.listener];
      } else if (Array.isArray(data)) {
        return data;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
};