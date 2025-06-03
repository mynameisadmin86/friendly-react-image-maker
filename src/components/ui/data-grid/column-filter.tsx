
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Column } from './types';

interface ColumnFilterProps {
  column: Column;
  onFilterChange: (key: string, value: string) => void;
  currentValue: string;
}

export const ColumnFilter: React.FC<ColumnFilterProps> = ({ 
  column, 
  onFilterChange, 
  currentValue 
}) => {
  console.log(`ColumnFilter rendered for ${column.key} with value: "${currentValue}"`);

  const handleFilterChange = useCallback((value: string) => {
    console.log(`Filter changed for ${column.key}: "${value}"`);
    onFilterChange(column.key, value);
  }, [column.key, onFilterChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange(e.target.value);
  }, [handleFilterChange]);

  if (!column.filterable) {
    console.warn(`Column ${column.key} is not filterable`);
    return null;
  }

  if (column.filterType === 'select' && column.filterOptions) {
    return (
      <Select value={currentValue || ''} onValueChange={handleFilterChange}>
        <SelectTrigger className="h-7 px-2 w-full text-xs">
          <SelectValue placeholder={`Filter ${column.header}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          {column.filterOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input 
      value={currentValue || ''} 
      onChange={handleInputChange}
      placeholder={`Filter ${column.header}`}
      className="h-7 px-2 text-xs"
      type={column.filterType === 'date' ? 'date' : 'text'}
    />
  );
};
