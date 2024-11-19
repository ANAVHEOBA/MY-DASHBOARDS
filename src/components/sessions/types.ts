// Common types that are shared across components and services
export interface Session {
    id: string;
    dateTime: string;
    userId: string;
    userName: string;
    listenerId: string | null;
    listenerName: string | null;
    status: 'unassigned' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
    duration: string;
    googleMeetLink?: string;
    priority: 'low' | 'medium' | 'high';
    requestDetails: string;
    preferredLanguages: string[];
    specialtyRequirements?: string[];
  }
  
  export interface Listener {
    id: string;
    name: string;
    specialties: string[];
    languages: string[];
    availabilityStatus: 'online' | 'offline' | 'in-session';
    availability: 'available' | 'busy' | 'offline';
    currentLoad: number;
    sessionsConducted: number;
    averageRating: number;
    currentSession?: {
      userId: string;
      userName: string;
      startTime: string;
      duration: number;
    };
    lastActive: string;
    responseRate: number;
    reportedIssues: number;
    verificationStatus: 'verified' | 'pending' | 'unverified';
    performanceMetrics: {
      satisfactionScore: number;
      completionRate: number;
      averageSessionDuration: number;
    };
  }
  
  export interface SessionFilterOptions {
    status: Session['status'] | 'all';
    priority: Session['priority'] | 'all';
    searchTerm: string;
  }