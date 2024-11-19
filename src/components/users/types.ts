import { User } from '@/services/types';
import { ReactNode } from 'react';

export interface UserTableColumn {
  key: string;
  title: string;
  render?: (value: any, user: User) => ReactNode;
}

export interface PaginationConfig {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface UserFilterOptions {
  status?: string;
  timeRange?: string;
  verificationStatus?: string;
}

// Re-export User type if needed
export type { User };