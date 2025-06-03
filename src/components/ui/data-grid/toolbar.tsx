
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterPopup } from '@/components/ui/filter-popup';
import { Filter, Columns, Download, FileText, File, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Column } from './types';

interface DataGridToolbarProps {
  title?: React.ReactNode;
  count?: number;
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  filterFields?: {
    name: string;
    label: string;
    type: 'text' | 'select' | 'date';
    options?: { label: string; value: string }[];
  }[];
  onFilterApply: (filters: any) => void;
  showColumnFilters: boolean;
  toggleColumnFilters: () => void;
  sortedColumns: Column[];
  visibleColumns: string[];
  toggleColumn: (columnKey: string) => void;
  toggleAllColumns: (checked: boolean) => void;
  handleColumnReorder: (column: Column, direction: 'up' | 'down') => void;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  onImport?: (data: any[]) => void;
}

export const DataGridToolbar: React.FC<DataGridToolbarProps> = ({
  title,
  count,
  searchValue,
  onSearchChange,
  isFilterOpen,
  setIsFilterOpen,
  filterFields,
  onFilterApply,
  showColumnFilters,
  toggleColumnFilters,
  sortedColumns,
  visibleColumns,
  toggleColumn,
  toggleAllColumns,
  handleColumnReorder,
  onExport,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilterButtonClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && file.type === 'text/csv' && onImport) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          // Map CSV headers to column keys
          const headerToKeyMap = new Map<string, string>();
          sortedColumns.forEach(col => {
            const matchingHeader = headers.find(h => 
              h.toLowerCase() === col.header.toLowerCase() ||
              h.toLowerCase() === col.key.toLowerCase()
            );
            if (matchingHeader) {
              headerToKeyMap.set(matchingHeader, col.key);
            }
          });
          
          if (headerToKeyMap.size === 0) {
            toast.error('No matching columns found in CSV');
            return;
          }
          
          // Parse data rows
          const importedData = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const rowData: Record<string, string> = {};
            
            // Extract values based on mapped headers
            headers.forEach((header, index) => {
              const key = headerToKeyMap.get(header);
              if (key && index < values.length) {
                rowData[key] = values[index];
              }
            });
            
            importedData.push(rowData);
          }
          
          if (importedData.length > 0 && onImport) {
            onImport(importedData);
            toast.success(`Imported ${importedData.length} records`);
          } else {
            toast.error('No valid data found in CSV');
          }
        } catch (error) {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse CSV file');
        }
      };
      
      reader.readAsText(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
            onOpenChange={setIsFilterOpen}
            fields={filterFields}
            onApplyFilter={onFilterApply}
            triggerElement={
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleFilterButtonClick} 
                aria-label="Filter data"
              >
                <Filter className="h-4 w-4" />
              </Button>
            }
          />
        )}
        
        {/* Column filters toggle button */}
        <Button
          variant={showColumnFilters ? "default" : "outline"}
          size="icon"
          onClick={toggleColumnFilters}
          aria-label="Toggle column filters"
          className={showColumnFilters ? "bg-logistics-blue" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        {/* Column visibility and sequencing dropdown */}
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
                  onCheckedChange={toggleAllColumns}
                />
                <label
                  htmlFor="all-columns"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Toggle all columns
                </label>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {sortedColumns.map((column) => (
                <ColumnItem 
                  key={column.key}
                  column={column}
                  toggleColumn={toggleColumn}
                  handleColumnReorder={handleColumnReorder}
                  visibleColumns={visibleColumns}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Import/Export dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              aria-label="Import/Export"
            >
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
            <DropdownMenuItem onClick={handleImportClick}>
              <Upload className="h-4 w-4 mr-2" />
              Import from CSV
            </DropdownMenuItem>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              className="hidden"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

interface ColumnItemProps {
  column: Column;
  visibleColumns: string[];
  toggleColumn: (columnKey: string) => void;
  handleColumnReorder: (column: Column, direction: 'up' | 'down') => void;
}

const ColumnItem: React.FC<ColumnItemProps> = ({ 
  column, 
  visibleColumns, 
  toggleColumn,
  handleColumnReorder 
}) => {
  const { CheckCircle2, ChevronUp, ChevronDown } = require('lucide-react');
  
  return (
    <div className="flex items-center justify-between px-2 py-1 hover:bg-muted/50">
      <div className="flex items-center space-x-2">
        <Checkbox 
          checked={visibleColumns.includes(column.key)}
          onCheckedChange={() => toggleColumn(column.key)}
          disabled={column.mandatory}
          id={`column-${column.key}`}
        />
        <label
          htmlFor={`column-${column.key}`}
          className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
        >
          {column.header}
          {column.mandatory && (
            <CheckCircle2 className="h-3 w-3 text-green-500" aria-label="Mandatory column" />
          )}
        </label>
      </div>
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => handleColumnReorder(column, 'up')}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => handleColumnReorder(column, 'down')}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
