import React, { useState } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, DollarSign, BookOpen,  FileText } from "lucide-react";
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


const chartData = [
  { name: 'Jan', totalOrder: 1500, grossProfit: 800 },
  { name: 'Feb', totalOrder: 1700, grossProfit: 1600 },
  { name: 'Mar', totalOrder: 1400, grossProfit: 1500 },
  { name: 'Apr', totalOrder: 1600, grossProfit: 1550 },
  { name: 'May', totalOrder: 1400, grossProfit: 1700 },
  { name: 'Jun', totalOrder: 1200, grossProfit: 1400 },
  { name: 'Jul', totalOrder: 1700, grossProfit: 1800 },
  { name: 'Aug', totalOrder: 1600, grossProfit: 1550 },
  { name: 'Sep', totalOrder: 200, grossProfit: 1500 },
  { name: 'Oct', totalOrder: 1000, grossProfit: 1450 },
  { name: 'Nov', totalOrder: 1400, grossProfit: 1700 },
  { name: 'Dec', totalOrder: 1500, grossProfit: 1650 },
];


interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="w-8 h-8 bg-[#FFF1E6] rounded-full flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        <TrendingUp className="mr-1 h-4 w-4 text-green-500 inline" />
        <span className="text-green-500">{change}% This week</span>
      </p>
    </CardContent>
  </Card>
);
  
  interface ActiveUserItemProps {
    label: string;
    value: string;
    change: number;
  }
  
  const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ label, value, change }) => (
    <div className="flex justify-between items-center">
      <span className="font-semibold">{label}</span>
      <div className="text-right">
        <p className="font-bold">{value}</p>
        <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
          {Math.abs(change)}%
        </p>
      </div>
    </div>
  );
  
  interface OrderRowProps {
    id: string;
    date: string;
    product: string;
    quantity: number;
    price: string;
    status: string;
  }
  
  const OrderRow: React.FC<OrderRowProps> = ({ id, date, product, quantity, price, status }) => (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{product}</TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>{price}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
          status === 'Delivered' ? 'bg-green-800' :
          status === 'Returned' ? 'bg-red-800' :
          'bg-yellow-800'
        }`}>
          {status}
        </span>
      </TableCell>
    </TableRow>
  );
  
  interface PopularProductProps {
    name: string;
    brand: string;
    change: number;
  }
  
  const PopularProduct: React.FC<PopularProductProps> = ({ name, brand, change }) => (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{brand}</p>
      </div>
      <p className="text-sm text-green-500">
        <ArrowUp className="inline h-3 w-3 mr-1" />
        {change}%
      </p>
    </div>
  );
  
  interface NotificationProps {
    text: string;
    time: string;
  }
  
  const Notification: React.FC<NotificationProps> = ({ text, time }) => (
    <div className="flex justify-between items-center text-sm">
      <p>{text}</p>
      <p className="text-muted-foreground">{time}</p>
    </div>
  );
  
  interface ChartLabelProps {
    color: string;
    label: string;
  }
  
  const ChartLabel: React.FC<ChartLabelProps> = ({ color, label }) => (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
  
  const Dashboard: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState('2024');
  
    return (
      <div className="p-6 bg-[#FFF8F3]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <MetricCard title="Total sales" value="500,000" change={5} icon={<DollarSign className="text-[#E68A4E]" />} />
          <MetricCard title="Comics uploaded" value="5" change={5} icon={<BookOpen className="text-[#E68A4E]" />} />
          <MetricCard title="Pending tasks" value="15" change={5} icon={<FileText className="text-[#E68A4E]" />} />
          <MetricCard title="Total Revenue" value="₦ 2,843,632" change={5} icon={<DollarSign className="text-[#E68A4E]" />} />
        </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Report & Analytics</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet consectetur.</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
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
            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalOrder" fill="#E68A4E" />
                    <Bar dataKey="grossProfit" fill="#FCD5B5" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-8">
                  <ChartLabel color="#E68A4E" label="Total Order" />
                  <ChartLabel color="#FCD5B5" label="Gross Profit" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active users</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="text-md font-semibold mb-4">Number of active users</h4>
            <div className="space-y-4">
              <ActiveUserItem label="Vendors" value="500,000" change={20} />
              <ActiveUserItem label="Artisans" value="300,000" change={0.5} />
              <ActiveUserItem label="Brands" value="50" change={6} />
              <ActiveUserItem label="Fans" value="2,000,000" change={-9} />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle>Website visit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const heights = [50, 80, 90, 100, 120, 70, 60];
                const heightPercentage = heights[index];
                const percentage = ((heightPercentage / 120) * 100).toFixed(0);

                return (
                  <div key={day} className="text-center">
                    <div 
                      className={`w-6 ${index === 4 ? 'bg-[#E68A4E]' : 'bg-[#FCD5B5]'}`} 
                      style={{ height: `${heightPercentage}px` }}
                    />
                    <p className="text-xs mt-1">{day}</p>
                    <p className="text-xs">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <OrderRow id="29..." date="Jan 24, 2020" product="Blend fabric sweater" quantity={17} price="$3,549" status="On transit" />
                <OrderRow id="2977" date="Jan 24, 2020" product="Full zip sweater" quantity={7} price="$3,549" status="On transit" />
                <OrderRow id="2971" date="Jan 19, 2020" product="Donegal sweater" quantity={45} price="$3,549" status="Delivered" />
                <OrderRow id="2975" date="Jan 24, 2020" product="Tennis sweater" quantity={9} price="$3,549" status="Returned" />
                <OrderRow id="29..." date="Jan 20, 2020" product="Cowl neck sweater" quantity={24} price="$3,549" status="On transit" />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Most popular products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PopularProduct name="Hoodies" brand="Chubbies x Blackbones" change={7} />
              <PopularProduct name="Snapbacks" brand="Chubbies x Blackbones" change={7} />
              <PopularProduct name="Stickers" brand="Chubbies x Blackbones" change={7} />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Notification text="New order received" time="3 hours ago" />
              <Notification text="Customer canceled order #1234" time="5 hours ago" />
              <Notification text="New user registered" time="1 day ago" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;