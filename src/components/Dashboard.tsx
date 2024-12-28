import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Users, 
  UserCheck, 
  Calendar,
  BarChart2,
  Clock,
  User,
  Headphones,
  Video
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data for the analytics chart
const chartData = [
  { name: 'Jan', totalSessions: 150, activeUsers: 800, activeListeners: 50 },
  { name: 'Feb', totalSessions: 170, activeUsers: 1600, activeListeners: 55 },
  { name: 'Mar', totalSessions: 140, activeUsers: 1500, activeListeners: 45 },
  { name: 'Apr', totalSessions: 160, activeUsers: 1550, activeListeners: 60 },
  { name: 'May', totalSessions: 140, activeUsers: 1700, activeListeners: 52 },
  { name: 'Jun', totalSessions: 120, activeUsers: 1400, activeListeners: 48 },
  // ... continue with remaining months
];

// Interfaces
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface ActiveUserItemProps {
  label: string;
  value: string;
  change: number;
}

interface SessionRowProps {
  id: string;
  date: string;
  user: string;
  listener: string;
  duration: string;
  status: string;
}

interface ListenerStatsProps {
  name: string;
  specialties: string;
  rating: number;
  sessionsCompleted: number;
}

interface NotificationProps {
  text: string;
  time: string;
  type: 'user' | 'listener' | 'session';
}

// Component Definitions (same structure, updated content)
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
  <Card className="transition-all hover:shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-xl sm:text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center mt-1">
        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
        <span className="text-green-500">{change}% This week</span>
      </p>
    </CardContent>
  </Card>
);

const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ label, value, change }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="font-semibold text-sm sm:text-base">{label}</span>
    <div className="text-right">
      <p className="font-bold text-sm sm:text-base">{value}</p>
      <p className={`text-xs sm:text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center justify-end`}>
        {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
        {Math.abs(change)}%
      </p>
    </div>
  </div>
);

const SessionRow: React.FC<SessionRowProps> = ({ id, date, user, listener, duration, status }) => (
  <TableRow>
    <TableCell className="font-medium">{id}</TableCell>
    <TableCell>{date}</TableCell>
    <TableCell>{user}</TableCell>
    <TableCell>{listener}</TableCell>
    <TableCell>{duration}</TableCell>
    <TableCell>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        status === 'Completed' ? 'bg-green-100 text-green-800' :
        status === 'Cancelled' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {status}
      </span>
    </TableCell>
  </TableRow>
);

const ListenerStats: React.FC<ListenerStatsProps> = ({ name, specialties, rating, sessionsCompleted }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <div>
      <p className="font-semibold text-sm sm:text-base">{name}</p>
      <p className="text-xs sm:text-sm text-muted-foreground">{specialties}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold">⭐ {rating.toFixed(1)}</p>
      <p className="text-xs text-muted-foreground">{sessionsCompleted} sessions</p>
    </div>
  </div>
);

const Notification: React.FC<{ text: string; time: string; type: 'user' | 'listener' | 'session' }> = ({ text, time, type }) => {
  const icons = {
    user: <User className="h-4 w-4 text-red-500" />,
    listener: <Headphones className="h-4 w-4 text-green-500" />,
    session: <Video className="h-4 w-4 text-purple-500" />
  };

  return (
    <div className="flex items-center py-2 border-b border-gray-100 last:border-0">
      <div className="mr-3">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  return (
    <div className="p-2 sm:p-6 bg-white min-h-screen">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard 
          title="Total Users" 
          value="25,431" 
          change={12} 
          icon={<Users className="text-red-500" />} 
        />
        <MetricCard 
          title="Active Listeners" 
          value="142" 
          change={8} 
          icon={<UserCheck className="text-green-500" />} 
        />
        <MetricCard 
          title="Total Sessions" 
          value="1,893" 
          change={15} 
          icon={<Calendar className="text-purple-500" />} 
        />
        <MetricCard 
          title="Completion Rate" 
          value="89%" 
          change={5} 
          icon={<BarChart2 className="text-orange-500" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Chart Card */}
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
                    {['2021', '2022', '2023', '2024'].map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button>Download Report</Button>
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
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalSessions" fill="#EF4444" />
                      <Bar dataKey="activeUsers" fill="#FCA5A5"  />
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
              <ActiveUserItem label="New Users" value="1,245" change={20} />
              <ActiveUserItem label="Active Users" value="18,556" change={12} />
              <ActiveUserItem label="Returning Users" value="8,126" change={5} />
              <ActiveUserItem label="Premium Users" value="2,854" change={15} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions and Top Listeners Section */}
      <div className="mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Sessions Table */}
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
                <SessionRow 
                  id="S-1234"
                  date="Mar 15, 2024"
                  user="John Doe"
                  listener="Sarah Smith"
                  duration="45 mins"
                  status="Completed"
                />
                <SessionRow 
                  id="S-1235"
                  date="Mar 15, 2024"
                  user="Alice Johnson"
                  listener="Mike Brown"
                  duration="30 mins"
                  status="In Progress"
                />
                <SessionRow 
                  id="S-1236"
                  date="Mar 14, 2024"
                  user="Emma Wilson"
                  listener="David Lee"
                  duration="60 mins"
                  status="Completed"
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Listeners and Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Listeners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <ListenerStats 
                name="Sarah Smith"
                specialties="Anxiety, Depression"
                rating={4.9}
                sessionsCompleted={156}
              />
              <ListenerStats 
                name="Mike Brown"
                specialties="Stress Management"
                rating={4.8}
                sessionsCompleted={142}
              />
              <ListenerStats 
                name="David Lee"
                specialties="Relationship Counseling"
                rating={4.7}
                sessionsCompleted={128}
              />
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Recent Activities</h4>
              <div className="space-y-2">
                <Notification 
                  text="New user registration: Emma Wilson"
                  time="2 hours ago"
                  type="user"
                />
                <Notification 
                  text="Session completed with Sarah Smith"
                  time="3 hours ago"
                  type="session"
                />
                <Notification 
                  text="New listener approved: James Chen"
                  time="5 hours ago"
                  type="listener"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;