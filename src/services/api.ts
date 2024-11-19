import axios from 'axios';
import { 
  User, 
  UserMetrics, 
  UserFilters, 
  Listener, 
  ListenerMetrics, 
  ListenerFilters,
  Session,
  SessionMetrics,
  ApiResponse 
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getUsers: async (filters?: UserFilters) => {
    const response = await api.get<ApiResponse<User[]>>('/users', { params: filters });
    return response.data.data;
  },

  getUserMetrics: async (timeRange: string) => {
    const response = await api.get<ApiResponse<UserMetrics>>('/users/metrics', {
      params: { timeRange }
    });
    return response.data.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data.data;
  },

  flagUser: async (userId: string, reason: string) => {
    const response = await api.post<ApiResponse<void>>(`/users/${userId}/flag`, { reason });
    return response.data.data;
  },

  exportUsers: async (filters?: UserFilters) => {
    const response = await api.get('/users/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: User['accountStatus']) => {
    const response = await api.patch<ApiResponse<User>>(`/users/${userId}/status`, { status });
    return response.data.data;
  }
};

export const sessionApi = {
  getSessions: async (filters?: Partial<{ status: string; priority: string }>) => {
    const response = await api.get<ApiResponse<Session[]>>('/sessions/monitor', { params: filters });
    return response.data.data;
  },

  getSession: async (id: string) => {
    const response = await api.get<ApiResponse<Session>>(`/sessions/${id}`);
    return response.data.data;
  },

  assignSession: async (sessionId: string, listenerId: string) => {
    const response = await api.patch<ApiResponse<Session>>(`/sessions/${sessionId}/assign`, {
      listenerId,
    });
    return response.data.data;
  },

  updateSessionStatus: async (sessionId: string, status: Session['status']) => {
    const response = await api.patch<ApiResponse<Session>>(`/sessions/${sessionId}/status`, {
      status,
    });
    return response.data.data;
  },

  getMetrics: async () => {
    const response = await api.get<ApiResponse<SessionMetrics>>('/sessions/metrics');
    return response.data.data;
  }
};

export const listenerApi = {
  getListeners: async (filters?: ListenerFilters) => {
    const response = await api.get<ApiResponse<Listener[]>>('/listeners/monitor', {
      params: filters
    });
    return response.data.data;
  },

  getAvailableListeners: async () => {
    const response = await api.get<ApiResponse<Listener[]>>('/listeners/available');
    return response.data.data;
  },

  getMetrics: async (timeRange: string) => {
    const response = await api.get<ApiResponse<ListenerMetrics>>('/listeners/metrics', {
      params: { timeRange }
    });
    return response.data.data;
  },

  getListenerDetails: async (listenerId: string) => {
    const response = await api.get<ApiResponse<Listener>>(`/listeners/${listenerId}`);
    return response.data.data;
  },

  updateStatus: async (listenerId: string, status: Listener['availabilityStatus']) => {
    const response = await api.patch<ApiResponse<Listener>>(`/listeners/${listenerId}/status`, {
      status
    });
    return response.data.data;
  },

  updateAvailability: async (id: string, availability: Listener['availability']) => {
    const response = await api.patch<ApiResponse<Listener>>(`/listeners/${id}/availability`, {
      availability,
    });
    return response.data.data;
  },

  reportIssue: async (listenerId: string, reason: string) => {
    await api.post<ApiResponse<void>>(`/listeners/${listenerId}/report`, { reason });
  }
};

export const analyticsApi = {
  getAnalytics: async (startDate: string, endDate: string) => {
    const response = await api.get<ApiResponse<any>>('/analytics', {
      params: { start: startDate, end: endDate }
    });
    return response.data.data;
  },

  exportAnalytics: async (format: 'CSV' | 'PDF', startDate: string, endDate: string) => {
    const response = await api.get('/analytics/export', {
      params: { format, start: startDate, end: endDate },
      responseType: 'blob'
    });
    return response.data;
  },

  getRealTimeMetrics: async () => {
    const response = await api.get<ApiResponse<any>>('/analytics/realtime');
    return response.data.data;
  }
};