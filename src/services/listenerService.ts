import { Listener, ApiResponse } from '../types/listener';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const listenerService = {
  createListener: async (listenerData: Partial<Listener>): Promise<ApiResponse> => {
    try {
      console.log('Making request to:', `${API_URL}/listeners`); // Debug log
      
      const response = await fetch(`${API_URL}/listeners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listenerData)
      });

      const data = await response.json();
      console.log('Response data:', data); // Debug log

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
      const response = await fetch(`${API_URL}/listeners`);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Log the response data for debugging
      console.log('GET Listeners Response:', data);
  
      // Handle the specific response format from your API
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