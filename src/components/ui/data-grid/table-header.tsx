
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDownUp, CheckCircle2 } from 'lucide-react';
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
  console.log('DataGridTableHeader rendered');

  if (mainColumns.length === 0) return null;

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
            <div 
              className={`flex items-center gap-1 ${column.sortable !== false ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (column.sortable !== false) {
                  onSort(column.key);
                }
              }}
            >
              {column.header}
              {column.sortable !== false && (
                <ArrowDownUp 
                  className={`h-4 w-4 ${sortState.column === column.key ? 'text-logistics-blue' : 'text-gray-400'}`} 
                  aria-label="Sort column"
                />
              )}
              {column.mandatory && (
                <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" aria-label="Mandatory column" />
              )}
            </div>
            
            {showColumnFilters && (
              <div className="mt-2">
                <ColumnFilter
                  column={column}
                  onFilterChange={onColumnFilterChange}
                  currentValue={columnFilters[column.key] || ''}
                />
              </div>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
