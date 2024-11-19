import React from 'react';
import { ListenerStatsProps } from './types';

export const ListenerStats: React.FC<ListenerStatsProps> = ({ name, specialties, rating, sessionsCompleted }) => (
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