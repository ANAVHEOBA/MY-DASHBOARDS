import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Listener } from '@/services/types';

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const getStatusColor = (status: Listener['availabilityStatus']): string => {
  switch (status) {
    case 'online':
      return 'bg-green-100 text-green-800';
    case 'in-session':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Remove the simpler version and keep the more robust one
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}