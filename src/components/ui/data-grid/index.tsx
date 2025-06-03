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
import { ChevronDown, ChevronRight, CheckCircle2, MoveHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DataGridProps, Column, SortState } from './types';
import { EditableCell } from './editable-cell';
import { ColumnFilter } from './column-filter';
import { PaginationControls } from './pagination-controls';
import { DataGridToolbar } from './toolbar';
import { SortableHeader } from './sortable-header';
import { SequencableColumn } from './sequencable-column';
import { useDragDropHandlers } from './drag-drop-handlers';

export * from './types';
export * from './editable-cell';
export * from './column-filter';
export * from './sortable-header';
export * from './sequencable-column';

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
  maxVisibleColumns = 5,
  mandatoryColumns = [],
}: DataGridProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [isDraggingColumn, setIsDraggingColumn] = useState<string | null>(null);
  
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

  // Filter data based on column filters
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    // If no column filters are active, return all data
    if (Object.keys(columnFilters).length === 0 || !showColumnFilters) {
      return data;
    }
    
    // Apply column filters
    return data.filter(item => {
      // Check each active column filter
      return Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true; // Skip empty filters
        
        const itemValue = String(item[key] || '').toLowerCase();
        return itemValue.includes(filterValue.toLowerCase());
      });
    });
  }, [data, columnFilters, showColumnFilters]);

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

  const handleFilterApply = (filters: any) => {
    if (onFilter) onFilter(filters);
    setIsFilterOpen(false);
  };

  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortState.column === column) {
      if (sortState.direction === 'asc') {
        direction = 'desc';
      } else if (sortState.direction === 'desc') {
        direction = null;
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

  // Handle column filter change
  const handleColumnFilterChange = (key: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle column filters visibility
  const toggleColumnFilters = () => {
    setShowColumnFilters(!showColumnFilters);
    if (!showColumnFilters) {
      // Clear filters when enabling to start fresh
      setColumnFilters({});
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

  // Update column sequence for drag and drop
  const updateColumnSequence = (sourceKey: string, targetKey: string) => {
    if (sourceKey === targetKey) return;

    const sourceIndex = sortedColumns.findIndex(col => col.key === sourceKey);
    const targetIndex = sortedColumns.findIndex(col => col.key === targetKey);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    const newColumns = [...sortedColumns];
    const movedColumn = newColumns.splice(sourceIndex, 1)[0];
    newColumns.splice(targetIndex, 0, movedColumn);
    
    // Update sequences
    newColumns.forEach((col, index) => {
      col.sequence = index;
      
      // Update in the original columns array
      const origCol = initialColumns.find(c => c.key === col.key);
      if (origCol) {
        origCol.sequence = index;
      }
    });
    
    // Force re-render
    setSortState({ ...sortState });
  };

  // Fix: Properly pass the updateColumnSequence function
  const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragDropHandlers(
    sortedColumns, 
    setIsDraggingColumn,
    updateColumnSequence
  );

  // Calculate pagination items based on filtered data
  const paginatedData = React.useMemo(() => {
    if (!pagination || !filteredData) return filteredData;
    
    const { currentPage } = pagination;
    const itemsPerPage = Math.ceil(filteredData.length / pagination.totalPages);
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  return (
    <>
      {showToolbar && (
        <DataGridToolbar 
          title={title}
          count={count}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          filterFields={filterFields}
          onFilterApply={handleFilterApply}
          showColumnFilters={showColumnFilters}
          toggleColumnFilters={toggleColumnFilters}
          sortedColumns={sortedColumns}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          toggleAllColumns={toggleAllColumns}
          handleColumnReorder={handleColumnReorder}
          onExport={handleExport}
          onImport={onImport}
        />
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
                          draggable 
                          onDragStart={() => handleDragStart(column.key)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(column.key)}
                          onDragEnd={handleDragEnd}
                          className={isDraggingColumn === column.key ? 'opacity-50' : ''}
                        >
                          <div className="flex items-center justify-between">
                            <div 
                              className={`flex items-center gap-1 ${column.sortable === false ? '' : 'cursor-pointer'}`}
                              onClick={() => {
                                if (column.sortable !== false) {
                                  handleSort(column.key);
                                }
                              }}
                            >
                              {column.header}
                              {column.sortable !== false && (
                                <SortableHeader
                                  column={column.key}
                                  currentSort={sortState}
                                  onSort={handleSort}
                                >
                                  {null}
                                </SortableHeader>
                              )}
                              {/* Fix: Using proper type check instead of truthy/falsy check */}
                              {column.mandatory === true && (
                                <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" aria-label="Mandatory column" />
                              )}
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                              title="Drag to reorder"
                            >
                              <MoveHorizontal className="h-3 w-3 text-gray-400" />
                            </Button>
                          </div>
                          
                          {/* Column filter */}
                          {showColumnFilters && (
                            <div className="mt-2">
                              <ColumnFilter
                                column={column}
                                onFilterChange={handleColumnFilterChange}
                                currentValue={columnFilters[column.key] || ''}
                              />
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                )}
                {filteredData && (
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={hasNestedColumns ? mainColumns.length + 1 : mainColumns.length} className="h-24 text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData?.map((row, rowIndex) => (
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
                                    <ChevronDown className="h-4 w-4" aria-label="Collapse row" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" aria-label="Expand row" />
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
                            <TableNestedRow isOpen={Boolean(expandedRows[rowIndex])}>
                              <TableCell colSpan={mainColumns.length + 1}>
                                <div className="p-2 grid grid-cols-2 md:grid-cols-3 gap-4 pl-8">
                                  {nestedColumns.map((column) => (
                                    <div key={column.key} className="flex flex-col space-y-1">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        {column.header}
                                        {/* Fix: Using proper type check instead of truthy/falsy check */}
                                        {column.mandatory === true && (
                                          <CheckCircle2 className="inline h-3 w-3 ml-1 text-green-500" aria-label="Mandatory column" />
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
        {pagination && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        )}
      </Card>
    </>
  );
};

export { DataGrid };
