export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ready-back-end.onrender.com';

export const API_ENDPOINTS = {
  sessions: {
    all: `${API_URL}/sessions/all`,
    create: `${API_URL}/sessions`,
    update: (id: string) => `${API_URL}/sessions/${id}`,
    delete: (id: string) => `${API_URL}/sessions/${id}`,
  },
  listeners: {
    all: `${API_URL}/listeners`,
    create: `${API_URL}/listeners`,
    update: (id: string) => `${API_URL}/listeners/${id}`,
    delete: (id: string) => `${API_URL}/listeners/${id}`,
  }
};