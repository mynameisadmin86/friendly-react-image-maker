
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Download, ArrowUpDown } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterPopup } from '@/components/ui/filter-popup';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

interface DataGridProps {
  title?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
  onSearch?: (value: string) => void;
  onFilter?: (filters: any) => void;
  onExport?: () => void;
  showToolbar?: boolean;
  onSortChange?: (sortState: SortState) => void;
  filterFields?: {
    name: string;
    label: string;
    type: 'text' | 'select' | 'date';
    options?: { label: string; value: string }[];
  }[];
}

const DataGrid = ({
  title,
  count,
  children,
  onSearch,
  onFilter,
  onExport,
  showToolbar = true,
  onSortChange,
  filterFields,
}: DataGridProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (onSearch) onSearch(value);
  };

  const handleFilterButtonClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterApply = (filters: any) => {
    if (onFilter) onFilter(filters);
    setIsFilterOpen(false);
  };

  return (
    <>
      {showToolbar && (
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
              onChange={handleSearchChange} 
            />
            {onFilter && filterFields && (
              <FilterPopup 
                isOpen={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                fields={filterFields}
                onApplyFilter={handleFilterApply}
                triggerElement={
                  <Button variant="outline" size="icon" onClick={handleFilterButtonClick}>
                    <Filter className="h-4 w-4" />
                  </Button>
                }
              />
            )}
            {onExport && (
              <Button variant="outline" size="icon" onClick={onExport}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      <Card>
        <Table>
          {children}
        </Table>
      </Card>
    </>
  );
};

// Sorting header component that we'll export for use in column headers
export const SortableHeader: React.FC<{
  column: string;
  children: React.ReactNode;
  currentSort: SortState;
  onSort: (column: string) => void;
}> = ({ column, children, currentSort, onSort }) => {
  const isActive = currentSort.column === column;
  
  return (
    <div 
      className="flex items-center gap-1 cursor-pointer" 
      onClick={() => onSort(column)}
    >
      {children}
      <ArrowUpDown 
        className={`h-4 w-4 ${isActive ? 'text-logistics-blue' : 'text-gray-400'}`} 
      />
    </div>
  );
};

export { DataGrid };
