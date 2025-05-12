
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'Fresh' | 'Under Amendment' | 'Confirmed' | 'Processing' | 'Completed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusClass = () => {
    switch(status) {
      case 'Fresh':
        return 'bg-blue-100 text-blue-700';
      case 'Under Amendment':
        return 'bg-orange-100 text-orange-700';
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-purple-100 text-purple-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', getStatusClass(), className)}>
      {status}
    </span>
  );
};

export default StatusBadge;
