
import React, { useCallback } from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown, ArrowUpDown, CheckCircle2, GripVertical } from 'lucide-react';
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
  onColumnReorder?: (dragIndex: number, hoverIndex: number) => void;
}

export const DataGridTableHeader: React.FC<DataGridTableHeaderProps> = ({
  mainColumns,
  hasNestedColumns,
  sortState,
  onSort,
  showColumnFilters,
  columnFilters,
  onColumnFilterChange,
  onColumnReorder
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
          <TableHead className="w-[120px] min-w-[120px] px-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span className="sr-only">Expand</span>
              </div>
              {showColumnFilters && (
                <div className="h-7"></div>
              )}
            </div>
          </TableHead>
        )}
        {mainColumns.map((column, index) => (
          <TableHead 
            key={column.key}
            className="relative"
            style={{ 
              width: column.width ? `${column.width}%` : 'auto',
              minWidth: '120px'
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {onColumnReorder && (
                  <GripVertical 
                    className="h-4 w-4 text-gray-400 cursor-move hover:text-gray-600" 
                    aria-label="Drag to reorder column"
                  />
                )}
                <div 
                  className={`flex items-center gap-1 flex-1 ${
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
              </div>
              
              {showColumnFilters && (
                <div className="w-full">
                  <ColumnFilter
                    column={column}
                    onFilterChange={onColumnFilterChange}
                    currentValue={columnFilters[column.key] || ''}
                  />
                </div>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
