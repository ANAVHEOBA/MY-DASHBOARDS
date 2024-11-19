import React from 'react';
import { Shield, Activity, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMetrics as MetricsType } from '@/services/types';

interface UserMetricsProps {
  metrics: MetricsType;
}

export const UserMetrics: React.FC<UserMetricsProps> = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total Active Users',
      value: metrics.totalActive,
      icon: <Shield className="h-4 w-4 text-gray-500" />
    },
    {
      title: 'New Today',
      value: metrics.newToday,
      icon: <Users className="h-4 w-4 text-gray-500" />
    },
    {
      title: 'Currently Online',
      value: metrics.currentlyOnline,
      icon: <Activity className="h-4 w-4 text-gray-500" />
    },
    {
      title: 'Reported Issues',
      value: metrics.reportedIssues,
      icon: <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};