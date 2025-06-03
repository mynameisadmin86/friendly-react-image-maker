
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterPopup } from '@/components/ui/filter-popup';
import { 
  Filter, 
  Download, 
  FileText, 
  File, 
  Columns, 
  Upload 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Column } from './types';

interface ToolbarProps {
  title?: React.ReactNode;
  count?: number;
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  onFilterApply: (filters: any) => void;
  filterFields?: any[];
  showColumnFilters: boolean;
  onToggleColumnFilters: () => void;
  sortedColumns: Column[];
  visibleColumns: string[];
  onToggleColumn: (columnKey: string) => void;
  onToggleAllColumns: (checked: boolean) => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  onImportClick: () => void;
}

export const DataGridToolbar: React.FC<ToolbarProps> = ({
  title,
  count,
  searchValue,
  onSearchChange,
  isFilterOpen,
  onFilterToggle,
  onFilterApply,
  filterFields,
  showColumnFilters,
  onToggleColumnFilters,
  sortedColumns,
  visibleColumns,
  onToggleColumn,
  onToggleAllColumns,
  onExport,
  onImportClick
}) => {
  console.log('DataGridToolbar rendered');

  return (
    <div className="flex justify-between items-center mb-4">
      {title && (
        <h2 className="text-lg font-medium flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="bg-logistics-blue text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {count}
            </span>
          )}
        </h2>
      )}
      <div className="flex items-center gap-3">
        <SearchBar 
          value={searchValue}
          onChange={onSearchChange} 
        />
        
        {filterFields && (
          <FilterPopup 
            isOpen={isFilterOpen}
            onOpenChange={() => {}}
            fields={filterFields}
            onApplyFilter={onFilterApply}
            triggerElement={
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onFilterToggle} 
                aria-label="Filter data"
              >
                <Filter className="h-4 w-4" />
              </Button>
            }
          />
        )}
        
        <Button
          variant={showColumnFilters ? "default" : "outline"}
          size="icon"
          onClick={onToggleColumnFilters}
          aria-label="Toggle column filters"
          className={showColumnFilters ? "bg-logistics-blue" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              aria-label="Columns settings"
            >
              <Columns className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Column Management</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox 
                  id="all-columns"
                  checked={visibleColumns.length === sortedColumns.length}
                  onCheckedChange={onToggleAllColumns}
                />
                <label htmlFor="all-columns" className="text-sm font-medium">
                  Toggle all columns
                </label>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {sortedColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2 px-2 py-1">
                  <Checkbox 
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={() => onToggleColumn(column.key)}
                    disabled={column.mandatory}
                    id={`column-${column.key}`}
                  />
                  <label htmlFor={`column-${column.key}`} className="text-sm">
                    {column.header}
                  </label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Import/Export">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Data Operations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onExport('csv')}>
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('excel')}>
              <File className="h-4 w-4 mr-2" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImportClick}>
              <Upload className="h-4 w-4 mr-2" />
              Import from CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
