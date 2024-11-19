import { Listener, ListenerMetrics } from '@/services/types';

export interface ListenerTableProps {
  listeners: Listener[];
  onListenerSelect: (listener: Listener) => void;
  getStatusColor: (status: Listener['availabilityStatus']) => string;
  formatDuration: (minutes: number) => string;
}

export interface ListenerDetailsProps {
  listener: Listener | null;
  showDetails: boolean;
  onClose: () => void;
  getStatusColor: (status: Listener['availabilityStatus']) => string;
  formatDuration: (minutes: number) => string;
}

export interface MetricsCardsProps {
  metrics: ListenerMetrics;
}