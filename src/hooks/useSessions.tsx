import { useState, useEffect } from 'react';
import { Session, SessionMetrics, Listener } from '@/components/sessions/types';
import { sessionApi } from '@/services/api';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalSessions: 0,
    unassignedSessions: 0,
    inProgressSessions: 0,
    completedToday: 0,
    averageWaitTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await sessionApi.getSessions();
      setSessions(data);
      updateMetrics(data);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMetrics = (sessionsData: Session[]) => {
    const unassigned = sessionsData.filter(s => s.status === 'unassigned').length;
    const inProgress = sessionsData.filter(s => s.status === 'in-progress').length;
    const completedToday = sessionsData.filter(s => {
      const today = new Date().toISOString().split('T')[0];
      return s.status === 'completed' && s.dateTime.includes(today);
    }).length;

    setMetrics({
      totalSessions: sessionsData.length,
      unassignedSessions: unassigned,
      inProgressSessions: inProgress,
      completedToday,
      averageWaitTime: calculateAverageWaitTime(sessionsData)
    });
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    sessions,
    metrics,
    isLoading,
    error,
    refreshSessions: fetchSessions
  };
};