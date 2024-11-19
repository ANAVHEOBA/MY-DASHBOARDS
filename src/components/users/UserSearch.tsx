import React from 'react';
import { Search } from 'lucide-react';

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search users by name, email, or location..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};