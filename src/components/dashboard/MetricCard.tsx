import React from 'react';
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCardProps } from './types';

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
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