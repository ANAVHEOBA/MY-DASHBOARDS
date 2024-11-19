import React from 'react';
import { Search } from 'lucide-react';

interface SessionSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SessionSearch: React.FC<SessionSearchProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    <input
      type="text"
      placeholder="Search sessions..."
      className="w-full pl-10 pr-4 py-2 border rounded-lg"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </div>
);