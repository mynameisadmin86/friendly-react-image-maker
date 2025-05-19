
import React from 'react';
import { ArrowDownUp } from 'lucide-react';
import { SortState } from './types';

interface SortableHeaderProps {
  column: string;
  children: React.ReactNode;
  currentSort: SortState;
  onSort: (column: string) => void;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({ 
  column, 
  children, 
  currentSort, 
  onSort 
}) => {
  const isActive = currentSort.column === column;
  
  return (
    <div 
      className="flex items-center gap-1 cursor-pointer" 
      onClick={() => onSort(column)}
    >
      {children}
      <ArrowDownUp 
        className={`h-4 w-4 ${isActive ? 'text-logistics-blue' : 'text-gray-400'}`} 
      />
    </div>
  );
};
