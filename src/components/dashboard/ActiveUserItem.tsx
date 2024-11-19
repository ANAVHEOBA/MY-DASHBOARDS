import React from 'react';
import { ArrowUp, ArrowDown } from "lucide-react";
import { ActiveUserItemProps } from './types';

export const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ label, value, change }) => (
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