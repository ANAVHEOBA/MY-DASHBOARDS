import React from 'react';
import { User, Headphones, Video } from "lucide-react";
import { NotificationProps } from './types';

export const Notification: React.FC<NotificationProps> = ({ text, time, type }) => {
  const icons = {
    user: <User className="h-4 w-4 text-blue-500" />,
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