
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Column } from './types';

interface SequencableColumnProps {
  column: Column;
  onReorder: (column: Column, direction: 'up' | 'down') => void;
}

export const SequencableColumn: React.FC<SequencableColumnProps> = ({ column, onReorder }) => {
  return (
    <div className="flex items-center">
      <span>{column.header}</span>
      <div className="flex flex-col ml-2">
        <Button variant="ghost" size="icon" onClick={() => onReorder(column, 'up')} className="h-4 w-4 p-0">
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onReorder(column, 'down')} className="h-4 w-4 p-0">
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
