import { ReactNode } from 'react';

export interface DashboardData {
  metrics: {
    totalUsers: number;
    activeListeners: number;
    totalSessions: number;
    completionRate: number;
  };
  userStats: {
    newUsers: number;
    activeUsers: number;
    returningUsers: number;
    premiumUsers: number;
  };
  chartData: Array<{
    name: string;
    totalSessions: number;
    activeUsers: number;
    activeListeners: number;
  }>;
  recentSessions: Array<SessionRowProps>;
  topListeners: Array<ListenerStatsProps>;
  recentActivities: Array<NotificationProps>;
}

export interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: ReactNode;
}

export interface ActiveUserItemProps {
  label: string;
  value: string;
  change: number;
}

export interface SessionRowProps {
  id: string;
  date: string;
  user: string;
  listener: string;
  duration: string;
  status: string;
}

export interface ListenerStatsProps {
  name: string;
  specialties: string;
  rating: number;
  sessionsCompleted: number;
}

export interface NotificationProps {
  text: string;
  time: string;
  type: 'user' | 'listener' | 'session';
}