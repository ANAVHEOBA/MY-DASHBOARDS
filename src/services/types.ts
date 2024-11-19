// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  lastLoginDate: string;
  accountStatus: 'active' | 'inactive';
  onlineStatus: 'online' | 'offline';
  totalSessions: number;
  lastSessionDate: string | null;
  reportedIssues: number;
  verificationStatus: 'verified' | 'unverified';
  loginAttempts: number;
  deviceInfo: string;
  location: string;
}

export interface UserMetrics {
  totalActive: number;
  newToday: number;
  currentlyOnline: number;
  reportedIssues: number;
}

export interface UserStats {
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  premiumUsers: number;
}

export interface UserFilters {
  timeRange?: string;
  status?: string;
  search?: string;
}

// Listener related types
export interface Listener {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  availabilityStatus: 'online' | 'offline' | 'in-session';
  availability: 'available' | 'busy' | 'offline';
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

export interface ListenerMetrics {
  totalActive: number;
  currentlyInSession: number;
  averageResponseTime: number;
  totalSessions: number;
  averageRating: number;
  totalReportedIssues: number;
}

export interface ListenerFilters {
  timeRange?: string;
  status?: string;
  specialty?: string;
  search?: string;
}

// Session related types
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

export interface SessionMetrics {
  totalSessions: number;
  unassignedSessions: number;
  inProgressSessions: number;
  completedToday: number;
  averageWaitTime: number;
}

// Analytics related types
export interface AnalyticsData {
  userRegistrations: number;
  userRetention: number;
  userEngagement: number;
  listenerPerformance: number;
  utilizationRate: number;
  listenerRatings: number;
  totalSessions: number;
  averageSessionDuration: number;
  cancellationRate: number;
  peakUsage: string;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// Dashboard related types
export interface DashboardMetrics {
  totalUsers: number;
  activeListeners: number;
  totalSessions: number;
  completionRate: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  userStats: UserStats;
  chartData: ChartDataPoint[];
  recentSessions: Session[];
  topListeners: Listener[];
  recentActivities: Activity[];
}

// Additional types for better type safety
export interface ChartDataPoint {
  name: string;
  value: number;
  date: string;
  [key: string]: any; // For additional dynamic properties
}

export interface Activity {
  id: string;
  type: 'user' | 'listener' | 'session';
  action: string;
  timestamp: string;
  details: {
    userId?: string;
    listenerId?: string;
    sessionId?: string;
    message: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}