import React from 'react';
import { Session, SessionFilterOptions } from './types'; // Rename the import

interface SessionFiltersProps {
  filters: SessionFilterOptions; // Use renamed type
  onFilterChange: (filters: Partial<SessionFilterOptions>) => void;
}

export const SessionFilters: React.FC<SessionFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => (
  <div className="flex flex-wrap gap-4 mb-6">
    <select
      className="border rounded-md px-3 py-2"
      value={filters.status}
      onChange={(e) => onFilterChange({ status: e.target.value as Session['status'] | 'all' })}
    >
      <option value="all">All Status</option>
      <option value="unassigned">Unassigned</option>
      <option value="assigned">Assigned</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>

    <select
      className="border rounded-md px-3 py-2"
      value={filters.priority}
      onChange={(e) => onFilterChange({ priority: e.target.value as Session['priority'] | 'all' })}
    >
      <option value="all">All Priorities</option>
      <option value="high">High Priority</option>
      <option value="medium">Medium Priority</option>
      <option value="low">Low Priority</option>
    </select>
  </div>
);