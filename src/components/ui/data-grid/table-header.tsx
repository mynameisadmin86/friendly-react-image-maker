
import React, { useCallback } from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown, ArrowUpDown, CheckCircle2 } from 'lucide-react';
import { ColumnFilter } from './column-filter';
import { Column, SortState } from './types';

interface DataGridTableHeaderProps {
  mainColumns: Column[];
  hasNestedColumns: boolean;
  sortState: SortState;
  onSort: (column: string) => void;
  showColumnFilters: boolean;
  columnFilters: Record<string, string>;
  onColumnFilterChange: (key: string, value: string) => void;
}

export const DataGridTableHeader: React.FC<DataGridTableHeaderProps> = ({
  mainColumns,
  hasNestedColumns,
  sortState,
  onSort,
  showColumnFilters,
  columnFilters,
  onColumnFilterChange
}) => {
  console.log('DataGridTableHeader rendered with', mainColumns.length, 'columns');

  const handleSort = useCallback((columnKey: string) => {
    console.log(`Sort requested for column: ${columnKey}`);
    onSort(columnKey);
  }, [onSort]);

  const getSortIcon = useCallback((columnKey: string) => {
    if (sortState.column !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    
    if (sortState.direction === 'asc') {
      return <ArrowUp className="h-4 w-4 text-primary" />;
    } else if (sortState.direction === 'desc') {
      return <ArrowDown className="h-4 w-4 text-primary" />;
    }
    
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  }, [sortState]);

  if (mainColumns.length === 0) {
    console.warn('No columns provided to DataGridTableHeader');
    return null;
  }

  return (
    <TableHeader>
      <TableRow>
        {hasNestedColumns && (
          <TableHead className="w-8 px-2">
            <span className="sr-only">Expand</span>
          </TableHead>
        )}
        {mainColumns.map((column) => (
          <TableHead 
            key={column.key}
            style={{ 
              width: column.width ? `${column.width}%` : 'auto',
              minWidth: '80px'
            }}
          >
            <div className="space-y-2">
              <div 
                className={`flex items-center gap-1 ${
                  column.sortable !== false ? 'cursor-pointer hover:text-primary' : ''
                }`}
                onClick={() => {
                  if (column.sortable !== false) {
                    handleSort(column.key);
                  }
                }}
                role={column.sortable !== false ? 'button' : undefined}
                tabIndex={column.sortable !== false ? 0 : undefined}
                onKeyDown={(e) => {
                  if (column.sortable !== false && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSort(column.key);
                  }
                }}
              >
                <span className="font-medium text-sm">{column.header}</span>
                {column.sortable !== false && getSortIcon(column.key)}
                {column.mandatory && (
                  <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" aria-label="Mandatory column" />
                )}
              </div>
              
              {showColumnFilters && column.filterable && (
                <ColumnFilter
                  column={column}
                  onFilterChange={onColumnFilterChange}
                  currentValue={columnFilters[column.key] || ''}
                />
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
