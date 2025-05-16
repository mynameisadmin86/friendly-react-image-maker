import React, { useState, useRef, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableNestedRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Download, 
  FileText, 
  File, 
  ArrowDownUp, 
  ArrowRightLeft, 
  Edit, 
  Check, 
  X, 
  Columns, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Upload, 
  CheckCircle2
} from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

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
  priority?: number; // Priority for column display (lower = higher priority)
  sequence?: number; // Sequence for column ordering
  mandatory?: boolean; // Mandatory flag - can't be hidden
  sortable?: boolean; // Whether column is sortable
}

export interface DataGridProps {
  title?: React.ReactNode;
  count?: number;
  columns?: Column[];
  data?: any[];
  children?: React.ReactNode;
  onSearch?: (value: string) => void;
  onFilter?: (filters: any) => void;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
  onImport?: (data: any[]) => void; // New callback for importing data
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
  maxVisibleColumns?: number; // Maximum number of columns to show before nesting
  mandatoryColumns?: string[]; // Array of column keys that cannot be hidden
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
          autoFocus
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
    <div className="flex items-center gap-1 group">
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
  onImport,
  showToolbar = true,
  onSortChange,
  filterFields,
  pagination,
  onRowEdit,
  defaultEditable = true,
  maxVisibleColumns = 5, // Default to showing 5 columns before nesting
  mandatoryColumns = [], // Default to no mandatory columns
}: DataGridProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialColumns.map(col => col.key)
  );
  
  // Add sequence if not provided and prepare columns with mandatory flag
  const preparedColumns = React.useMemo(() => {
    return initialColumns.map((col, index) => ({
      ...col,
      sequence: col.sequence !== undefined ? col.sequence : index,
      mandatory: col.mandatory !== undefined ? col.mandatory : 
                 mandatoryColumns.includes(col.key) || 
                 (index === 0 && mandatoryColumns.length === 0) // First column is mandatory by default
    }));
  }, [initialColumns, mandatoryColumns]);

  // Sort columns by sequence
  const sortedColumns = React.useMemo(() => {
    return [...preparedColumns].sort((a, b) => 
      (a.sequence || 0) - (b.sequence || 0)
    );
  }, [preparedColumns]);
  
  // Get only the columns that should be visible
  const filteredColumns = React.useMemo(() => 
    sortedColumns.filter(col => visibleColumns.includes(col.key)),
    [sortedColumns, visibleColumns]
  );

  // Separate columns into main and nested based on maxVisibleColumns
  const mainColumns = filteredColumns.slice(0, maxVisibleColumns);
  const hasNestedColumns = filteredColumns.length > maxVisibleColumns;
  const nestedColumns = hasNestedColumns ? filteredColumns.slice(maxVisibleColumns) : [];

  // Initialize with mandatory columns
  useEffect(() => {
    // Make sure all mandatory columns are visible
    const mandatoryColumnKeys = preparedColumns
      .filter(col => col.mandatory)
      .map(col => col.key);
    
    if (mandatoryColumnKeys.some(key => !visibleColumns.includes(key))) {
      setVisibleColumns(prevVisible => {
        const newVisible = [...prevVisible];
        mandatoryColumnKeys.forEach(key => {
          if (!newVisible.includes(key)) {
            newVisible.push(key);
          }
        });
        return newVisible;
      });
    }
  }, [preparedColumns, visibleColumns]);

  const toggleRowExpand = (rowIndex: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

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

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (onExport) onExport(format);
    
    // Basic CSV export implementation if onExport not provided
    if (!onExport && format === 'csv' && data && data.length > 0) {
      try {
        // Get all visible column keys
        const allVisibleColumns = [...mainColumns, ...nestedColumns];
        const headers = allVisibleColumns.map(col => col.header);
        const keys = allVisibleColumns.map(col => col.key);
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        // Add data rows
        data.forEach(row => {
          const rowData = keys.map(key => {
            const value = row[key];
            // Handle commas and quotes in the data
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value !== undefined && value !== null ? value : '';
          });
          csvContent += rowData.join(',') + '\n';
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('CSV exported successfully');
      } catch (error) {
        console.error('Error exporting CSV:', error);
        toast.error('Failed to export CSV');
      }
    }
  };

  const handleColumnReorder = (column: Column, direction: 'up' | 'down') => {
    const currentIndex = sortedColumns.findIndex(col => col.key === column.key);
    if (currentIndex === -1) return;
    
    // Don't move if it's already at the top/bottom
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sortedColumns.length - 1)) {
      return;
    }
    
    const newColumns = [...sortedColumns];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap the sequence values
    const currentSeq = newColumns[currentIndex].sequence || 0;
    const targetSeq = newColumns[targetIndex].sequence || 0;
    
    newColumns[currentIndex] = { ...newColumns[currentIndex], sequence: targetSeq };
    newColumns[targetIndex] = { ...newColumns[targetIndex], sequence: currentSeq };
    
    // Since we're updating initialColumns, component should re-render with new order
    // This is a bit of a hack since we can't directly modify the props
    // In a real app, this would be handled by the parent component
    initialColumns.forEach(col => {
      const updated = newColumns.find(c => c.key === col.key);
      if (updated) {
        col.sequence = updated.sequence;
      }
    });
    
    // Force re-render by updating a state
    setSortState({ ...sortState });
  };

  // Toggle column visibility with improved function
  const toggleColumn = (columnKey: string) => {
    const columnToToggle = preparedColumns.find(col => col.key === columnKey);
    
    // Don't allow hiding mandatory columns
    if (columnToToggle?.mandatory) {
      toast.error(`Cannot hide mandatory column: ${columnToToggle.header}`);
      return;
    }
    
    setVisibleColumns(currentVisible => {
      if (currentVisible.includes(columnKey)) {
        // Prevent hiding all columns
        if (currentVisible.length <= 1) {
          toast.error("At least one column must be visible");
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
      // Only keep mandatory columns visible
      const mandatoryKeys = preparedColumns
        .filter(col => col.mandatory)
        .map(col => col.key);
      
      if (mandatoryKeys.length === 0) {
        // If no mandatory columns, keep the first column visible
        setVisibleColumns([initialColumns[0].key]);
      } else {
        setVisibleColumns(mandatoryKeys);
      }
    }
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          // Map CSV headers to column keys
          const headerToKeyMap = new Map<string, string>();
          preparedColumns.forEach(col => {
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

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
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
            
            {/* Column visibility and sequencing dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Columns settings">
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
                      checked={visibleColumns.length === initialColumns.length}
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
                    <div key={column.key} className="flex items-center justify-between px-2 py-1 hover:bg-muted/50">
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
                            <CheckCircle2 className="h-3 w-3 text-green-500" title="Mandatory column" />
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
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Import/Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Import/Export">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Data Operations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
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
      )}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            {children || (
              <>
                {mainColumns.length > 0 && (
                  <TableHeader>
                    <TableRow>
                      {/* Add an expand column if we have nested columns */}
                      {hasNestedColumns && (
                        <TableHead className="w-8 px-2">
                          <span className="sr-only">Expand</span>
                        </TableHead>
                      )}
                      {mainColumns.map((column, index) => (
                        <TableHead 
                          key={column.key}
                          style={{ 
                            width: column.width ? `${column.width}%` : 'auto',
                            minWidth: '80px'
                          }}
                        >
                          <div 
                            className={`flex items-center gap-1 ${column.sortable !== false ? 'cursor-pointer' : ''}`}
                            onClick={() => column.sortable !== false && handleSort(column.key)}
                          >
                            {column.header}
                            {column.sortable !== false && (
                              <ArrowDownUp 
                                className={`h-4 w-4 ${sortState.column === column.key ? 'text-logistics-blue' : 'text-gray-400'}`} 
                              />
                            )}
                            {column.mandatory && (
                              <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" title="Mandatory column" />
                            )}
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
                        <TableCell colSpan={hasNestedColumns ? mainColumns.length + 1 : mainColumns.length} className="h-24 text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                          <TableRow className="group">
                            {/* Expansion toggle button */}
                            {hasNestedColumns && (
                              <TableCell className="w-8 px-2 relative">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0 hover:bg-muted rounded-full"
                                  onClick={() => toggleRowExpand(rowIndex)}
                                >
                                  {expandedRows[rowIndex] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                            )}
                            
                            {/* Main columns */}
                            {mainColumns.map((column) => (
                              <TableCell 
                                key={column.key}
                                style={{ 
                                  width: column.width ? `${column.width}%` : 'auto',
                                  minWidth: '80px'
                                }}
                              >
                                {column.cell ? column.cell(row[column.key], row) : (
                                  onRowEdit && column.isEditable !== false ? (
                                    <EditableCell
                                      value={row[column.key]}
                                      rowIndex={rowIndex}
                                      columnKey={column.key}
                                      isEditable={column.isEditable !== false}
                                      onEdit={onRowEdit}
                                    />
                                  ) : (
                                    row[column.key]
                                  )
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                          
                          {/* Nested row with additional columns */}
                          {hasNestedColumns && (
                            <TableNestedRow isOpen={expandedRows[rowIndex]}>
                              <TableCell colSpan={mainColumns.length + 1}>
                                <div className="p-2 grid grid-cols-2 md:grid-cols-3 gap-4 pl-8">
                                  {nestedColumns.map((column) => (
                                    <div key={column.key} className="flex flex-col space-y-1">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        {column.header}
                                        {column.mandatory && (
                                          <CheckCircle2 className="inline h-3 w-3 ml-1 text-green-500" title="Mandatory column" />
                                        )}
                                      </span>
                                      <div>
                                        {column.cell ? column.cell(row[column.key], row) : (
                                          onRowEdit && column.isEditable !== false ? (
                                            <EditableCell
                                              value={row[column.key]}
                                              rowIndex={rowIndex}
                                              columnKey={column.key}
                                              isEditable={column.isEditable !== false}
                                              onEdit={onRowEdit}
                                            />
                                          ) : (
                                            row[column.key]
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                            </TableNestedRow>
                          )}
                        </React.Fragment>
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
      <ArrowDownUp 
        className={`h-4 w-4 ${isActive ? 'text-logistics-blue' : 'text-gray-400'}`} 
      />
    </div>
  );
};

// Column sequencing component
export const SequencableColumn: React.FC<{
  column: Column;
  onReorder: (column: Column, direction: 'up' | 'down') => void;
}> = ({ column, onReorder }) => {
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

export { DataGrid };
