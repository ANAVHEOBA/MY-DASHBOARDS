import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { SessionRowProps } from './types';

export const SessionRow: React.FC<SessionRowProps> = ({ id, date, user, listener, duration, status }) => (
  <TableRow>
    <TableCell className="font-medium">{id}</TableCell>
    <TableCell>{date}</TableCell>
    <TableCell>{user}</TableCell>
    <TableCell>{listener}</TableCell>
    <TableCell>{duration}</TableCell>
    <TableCell>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        status === 'Completed' ? 'bg-green-100 text-green-800' :
        status === 'Cancelled' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {status}
      </span>
    </TableCell>
  </TableRow>
);