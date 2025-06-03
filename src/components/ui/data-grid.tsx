import React, { useState, useRef } from 'react';
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
import { Filter, Download, File, FileText, ArrowUpDown, Edit, Check, X, Columns, Settings } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterPopup } from '@/components/ui/filter-popup';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface Column {
  key: string;
  header: string;
  isEditable?: boolean;
  cell?: (value: any, row: any) => React.ReactNode;
  width?: number; // Width for resizable columns
}

export interface DataGridProps {
  title?: React.ReactNode;
  count?: number;
  columns?: Column[];
  data?: any[];
  children?: React.ReactNode;
  onSearch?: (value: string) => void;
  onFilter?: (filters: any) => void;
  onExport?: (format: 'pdf' | 'excel') => void;
  showToolbar?: boolean;
  onSortChange?: (sortState: SortState) => void;
  filterFields?: {
    name: string;
    label: string;
    type: 'text' | 'select' | 'date';
    options?: { label: string; value: string }[];
  }[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onRowEdit?: (rowIndex: number, key: string, value: any) => void;
  defaultEditable?: boolean;
}

export interface EditableCellProps {
  value: any;
  rowIndex: number;
  columnKey: string;
  isEditable: boolean;
  onEdit: (rowIndex: number, columnKey: string, value: any) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  rowIndex,
  columnKey,
  isEditable,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  if (!isEditable) {
    return <span>{value}</span>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(rowIndex, columnKey, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-8 py-1 px-2"
        />
        <Button variant="ghost" size="icon" onClick={handleSave} className="h-6 w-6">
          <Check className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCancel} className="h-6 w-6">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span>{value}</span>
      <Button variant="ghost" size="icon" onClick={handleEdit} className="h-6 w-6 opacity-0 group-hover:opacity-100">
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};

const DataGrid = ({
  title,
  count,
  columns: initialColumns = [],
  data,
  children,
  onSearch,
  onFilter,
  onExport,
  showToolbar = true,
  onSortChange,
  filterFields,
  pagination,
  onRowEdit,
  defaultEditable = true,
}: DataGridProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialColumns.map(col => col.key)
  );
  
  // Get only the columns that should be visible
  const filteredColumns = initialColumns.filter(col => 
    visibleColumns.includes(col.key)
  );

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

  const handleSort = (column: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortState.column === column) {
      if (sortState.direction === 'asc') {
        direction = 'desc';
      } else if (sortState.direction === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }
    
    const newSortState = { column, direction };
    setSortState(newSortState);
    
    if (onSortChange) onSortChange(newSortState);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (onExport) onExport(format);
  };

  // Toggle column visibility with improved function
  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(currentVisible => {
      if (currentVisible.includes(columnKey)) {
        // Prevent hiding all columns
        if (currentVisible.length <= 1) {
          return currentVisible;
        }
        return currentVisible.filter(key => key !== columnKey);
      } else {
        return [...currentVisible, columnKey];
      }
    });
  };

  // Toggle all columns
  const toggleAllColumns = (checked: boolean) => {
    if (checked) {
      setVisibleColumns(initialColumns.map(col => col.key));
    } else {
      // Always keep at least one column visible
      setVisibleColumns([initialColumns[0].key]);
    }
  };

  // Render pagination component
  const renderPagination = () => {
    if (!pagination) return null;

    const { currentPage, totalPages, onPageChange } = pagination;
    
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
                </PaginationItem>
                {startPage > 2 && (
                  <PaginationItem>
                    <PaginationLink className="cursor-default">...</PaginationLink>
                  </PaginationItem>
                )}
              </>
            )}
            
            {pages.map(page => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink className="cursor-default">...</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
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
                  <Button variant="outline" size="icon" onClick={handleFilterButtonClick} title="Filter data">
                    <Filter className="h-4 w-4" />
                  </Button>
                }
              />
            )}
            
            {/* Column visibility dropdown - Enhanced with better UI */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Show/Hide columns">
                  <Columns className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="flex items-center space-x-2 pb-2">
                    <Checkbox 
                      id="all-columns"
                      checked={visibleColumns.length === initialColumns.length}
                      onCheckedChange={toggleAllColumns}
                    />
                    <label
                      htmlFor="all-columns"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Select all
                    </label>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {initialColumns.map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={() => toggleColumn(column.key)}
                    disabled={visibleColumns.length === 1 && visibleColumns.includes(column.key)}
                  >
                    {column.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {onExport && (
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => handleExport('pdf')} title="Export as PDF">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleExport('excel')} title="Export as Excel">
                  <File className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            {children || (
              <>
                {filteredColumns.length > 0 && (
                  <TableHeader>
                    <TableRow>
                      {filteredColumns.map((column, index) => (
                        <TableHead 
                          key={column.key}
                          style={{ 
                            width: column.width ? `${column.width}%` : 'auto',
                            minWidth: '80px'
                          }}
                        >
                          <div 
                            className="flex items-center gap-1 cursor-pointer" 
                            onClick={() => handleSort(column.key)}
                          >
                            {column.header}
                            <ArrowUpDown 
                              className={`h-4 w-4 ${sortState.column === column.key ? 'text-logistics-blue' : 'text-gray-400'}`} 
                            />
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                )}
                {data && (
                  <TableBody>
                    {data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={filteredColumns?.length || 1} className="h-24 text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="group">
                          {filteredColumns?.map((column) => (
                            <TableCell 
                              key={column.key}
                              style={{ 
                                width: column.width ? `${column.width}%` : 'auto',
                                minWidth: '80px'
                              }}
                            >
                              {column.cell ? column.cell(row[column.key], row) : (
                                onRowEdit ? (
                                  <EditableCell
                                    value={row[column.key]}
                                    rowIndex={rowIndex}
                                    columnKey={column.key}
                                    isEditable={column.isEditable !== undefined ? column.isEditable : defaultEditable}
                                    onEdit={onRowEdit}
                                  />
                                ) : (
                                  row[column.key]
                                )
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                )}
              </>
            )}
          </Table>
        </div>
        {renderPagination()}
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
