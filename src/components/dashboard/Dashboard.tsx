import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar,
  BarChart2,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";

import { MetricCard } from './MetricCard';
import { ActiveUserItem } from './ActiveUserItem';
import { SessionRow } from './SessionRow';
import { ListenerStats } from './ListenerStats';
import { Notification } from './Notification';
import { useDashboard } from '../../hooks/useDashboard';
import type { DashboardData } from './types';

const initialData: DashboardData = {
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
};

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const { data = initialData, loading, error } = useDashboard(selectedPeriod);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  const handleDownloadReport = async () => {
    try {
      console.log('Downloading report...');
    } catch (err) {
      console.error('Error downloading report:', err);
    }
  };

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-screen">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard 
          title="Total Users" 
          value={data.metrics.totalUsers.toLocaleString()} 
          change={12} 
          icon={<Users className="text-blue-500" />} 
        />
        <MetricCard 
          title="Active Listeners" 
          value={data.metrics.activeListeners.toLocaleString()} 
          change={8} 
          icon={<UserCheck className="text-green-500" />} 
        />
        <MetricCard 
          title="Total Sessions" 
          value={data.metrics.totalSessions.toLocaleString()} 
          change={15} 
          icon={<Calendar className="text-purple-500" />} 
        />
        <MetricCard 
          title="Completion Rate" 
          value={`${data.metrics.completionRate}%`} 
          change={5} 
          icon={<BarChart2 className="text-orange-500" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-lg sm:text-xl">Platform Analytics</CardTitle>
                <CardDescription className="text-sm">Overview of users, listeners, and sessions</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleDownloadReport}>Download Report</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full sm:w-auto flex justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="listeners">Listeners</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalSessions" fill="#9333EA" />
                      <Bar dataKey="activeUsers" fill="#3B82F6" />
                      <Bar dataKey="activeListeners" fill="#22C55E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <ActiveUserItem 
                label="New Users" 
                value={data.userStats.newUsers.toLocaleString()} 
                change={20} 
              />
              <ActiveUserItem 
                label="Active Users" 
                value={data.userStats.activeUsers.toLocaleString()} 
                change={12} 
              />
              <ActiveUserItem 
                label="Returning Users" 
                value={data.userStats.returningUsers.toLocaleString()} 
                change={5} 
              />
              <ActiveUserItem 
                label="Premium Users" 
                value={data.userStats.premiumUsers.toLocaleString()} 
                change={15} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions and Top Listeners Section */}
      <div className="mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Listener</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentSessions.map((session) => (
                  <SessionRow key={session.id} {...session} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Listeners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {data.topListeners.map((listener, index) => (
                <ListenerStats key={index} {...listener} />
              ))}
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Recent Activities</h4>
              <div className="space-y-2">
                {data.recentActivities.map((activity, index) => (
                  <Notification key={index} {...activity} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;