import { useState, useEffect } from 'react';
import { analyticsApi, userApi, listenerApi } from '@/services/api';
import type { DashboardData } from '@/components/dashboard/types';

export const useDashboard = (period: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    metrics: {
      totalUsers: 0,
      activeListeners: 0,
      totalSessions: 0,
      completionRate: 0
    },
    userStats: {
      newUsers: 0,
      activeUsers: 0,
      returningUsers: 0,
      premiumUsers: 0
    },
    chartData: [],
    recentSessions: [],
    topListeners: [],
    recentActivities: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [analytics, userMetrics, listenerMetrics] = await Promise.all([
          analyticsApi.getAnalytics(period, period),
          userApi.getUserMetrics(period),
          listenerApi.getMetrics(period)
        ]);

        // Transform the data
        setData({
          metrics: {
            totalUsers: analytics.metrics.totalUsers,
            activeListeners: listenerMetrics.totalActive,
            totalSessions: analytics.metrics.totalSessions,
            completionRate: Math.round((listenerMetrics.totalSessions - listenerMetrics.totalReportedIssues) / listenerMetrics.totalSessions * 100)
          },
          userStats: {
            newUsers: userMetrics.newToday,
            activeUsers: userMetrics.totalActive,
            returningUsers: analytics.metrics.returningUsers,
            premiumUsers: analytics.metrics.premiumUsers
          },
          chartData: analytics.trends.daily,
          recentSessions: [], // Add your sessions data transformation here
          topListeners: [], // Add your listeners data transformation here
          recentActivities: [] // Add your activities data transformation here
        });

      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [period]);

  return { data, loading, error };
};