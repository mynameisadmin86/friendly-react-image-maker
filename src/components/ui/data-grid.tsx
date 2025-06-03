import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Table } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { DataGridToolbar } from './data-grid/toolbar';
import { DataGridTableHeader } from './data-grid/table-header';
import { DataGridTableBody } from './data-grid/table-body';
import { DataGridPagination } from './data-grid/pagination';
import { DataGridProps, SortState, SortDirection } from './data-grid/types';

export * from './data-grid/types';
export { EditableCell } from './data-grid/editable-cell';

export const DataGrid: React.FC<DataGridProps> = ({
  title,
  count,
  columns: initialColumns = [],
  data = [],
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
}) => {
  console.log('DataGrid component rendered with', data.length, 'items');

  // State management
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialColumns.map(col => col.key)
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized column processing
  const preparedColumns = useMemo(() => {
    console.log('Processing columns with mandatory flags');
    return initialColumns.map((col, index) => ({
      ...col,
      sequence: col.sequence !== undefined ? col.sequence : index,
      mandatory: col.mandatory !== undefined ? col.mandatory : 
                 mandatoryColumns.includes(col.key) || 
                 (index === 0 && mandatoryColumns.length === 0)
    }));
  }, [initialColumns, mandatoryColumns]);

  const sortedColumns = useMemo(() => {
    return [...preparedColumns].sort((a, b) => 
      (a.sequence || 0) - (b.sequence || 0)
    );
  }, [preparedColumns]);
  
  const filteredColumns = useMemo(() => 
    sortedColumns.filter(col => visibleColumns.includes(col.key)),
    [sortedColumns, visibleColumns]
  );

  const filteredData = useMemo(() => {
    if (!showColumnFilters || Object.keys(columnFilters).length === 0) {
      return data;
    }
    
    console.log('Applying column filters:', columnFilters);
    return data.filter(item => {
      return Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        
        const itemValue = String(item[key] || '').toLowerCase();
        return itemValue.includes(filterValue.toLowerCase());
      });
    });
  }, [data, columnFilters, showColumnFilters]);

  const mainColumns = useMemo(() => filteredColumns.slice(0, maxVisibleColumns), [filteredColumns, maxVisibleColumns]);
  const hasNestedColumns = filteredColumns.length > maxVisibleColumns;
  const nestedColumns = useMemo(() => hasNestedColumns ? filteredColumns.slice(maxVisibleColumns) : [], [filteredColumns, hasNestedColumns, maxVisibleColumns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const { currentPage, totalPages } = pagination;
    const itemsPerPage = Math.ceil(filteredData.length / totalPages);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  // Event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`Search changed: "${value}"`);
    setSearchValue(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleFilterApply = useCallback((filters: any) => {
    console.log('Filters applied:', filters);
    onFilter?.(filters);
    setIsFilterOpen(false);
  }, [onFilter]);

  const handleSort = useCallback((column: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortState.column === column) {
      direction = sortState.direction === 'asc' ? 'desc' : 
                  sortState.direction === 'desc' ? null : 'asc';
    }
    
    const newSortState = { column, direction };
    console.log('Sort state changed:', newSortState);
    setSortState(newSortState);
    onSortChange?.(newSortState);
  }, [sortState, onSortChange]);

  const toggleRowExpand = useCallback((rowIndex: number) => {
    console.log(`Toggling row expand for index: ${rowIndex}`);
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  }, []);

  const handleColumnFilterChange = useCallback((key: string, value: string) => {
    console.log(`Column filter changed: ${key} = "${value}"`);
    setColumnFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const toggleColumnFilters = useCallback(() => {
    const newState = !showColumnFilters;
    console.log(`Toggling column filters: ${newState}`);
    setShowColumnFilters(newState);
    if (!newState) {
      setColumnFilters({});
    }
  }, [showColumnFilters]);

  const toggleColumn = useCallback((columnKey: string) => {
    const columnToToggle = preparedColumns.find(col => col.key === columnKey);
    
    if (columnToToggle?.mandatory) {
      toast.error(`Cannot hide mandatory column: ${columnToToggle.header}`);
      return;
    }
    
    console.log(`Toggling column visibility: ${columnKey}`);
    setVisibleColumns(currentVisible => {
      if (currentVisible.includes(columnKey)) {
        if (currentVisible.length <= 1) {
          toast.error("At least one column must be visible");
          return currentVisible;
        }
        return currentVisible.filter(key => key !== columnKey);
      } else {
        return [...currentVisible, columnKey];
      }
    });
  }, [preparedColumns]);

  const toggleAllColumns = useCallback((checked: boolean) => {
    console.log(`Toggling all columns: ${checked}`);
    if (checked) {
      setVisibleColumns(initialColumns.map(col => col.key));
    } else {
      const mandatoryKeys = preparedColumns
        .filter(col => col.mandatory)
        .map(col => col.key);
      
      setVisibleColumns(mandatoryKeys.length > 0 ? mandatoryKeys : [initialColumns[0]?.key]);
    }
  }, [initialColumns, preparedColumns]);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log(`Exporting as ${format}`);
    if (onExport) {
      onExport(format);
      return;
    }
    
    // Basic CSV export implementation
    if (format === 'csv' && data && data.length > 0) {
      try {
        const allVisibleColumns = [...mainColumns, ...nestedColumns];
        const headers = allVisibleColumns.map(col => col.header);
        const keys = allVisibleColumns.map(col => col.key);
        
        let csvContent = headers.join(',') + '\n';
        
        data.forEach(row => {
          const rowData = keys.map(key => {
            const value = row[key];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value !== undefined && value !== null ? value : '';
          });
          csvContent += rowData.join(',') + '\n';
        });
        
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

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
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
          
          const importedData = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const rowData: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              const key = headerToKeyMap.get(header);
              if (key && index < values.length) {
                rowData[key] = values[index];
              }
            });
            
            importedData.push(rowData);
          }
          
          if (importedData.length > 0 && onImport) {
            console.log(`Importing ${importedData.length} records`);
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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    console.log('Import button clicked');
    fileInputRef.current?.click();
  };

  return (
    <>
      {showToolbar && (
        <DataGridToolbar
          title={title}
          count={count}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onFilterApply={handleFilterApply}
          filterFields={filterFields}
          showColumnFilters={showColumnFilters}
          onToggleColumnFilters={toggleColumnFilters}
          sortedColumns={sortedColumns}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumn}
          onToggleAllColumns={toggleAllColumns}
          onExport={handleExport}
          onImportClick={() => fileInputRef.current?.click()}
        />
      )}
      
      <Card>
        <div className="overflow-x-auto">
          <Table>
            {children || (
              <>
                <DataGridTableHeader
                  mainColumns={mainColumns}
                  hasNestedColumns={hasNestedColumns}
                  sortState={sortState}
                  onSort={handleSort}
                  showColumnFilters={showColumnFilters}
                  columnFilters={columnFilters}
                  onColumnFilterChange={handleColumnFilterChange}
                />
                <DataGridTableBody
                  filteredData={filteredData}
                  paginatedData={paginatedData}
                  mainColumns={mainColumns}
                  nestedColumns={nestedColumns}
                  hasNestedColumns={hasNestedColumns}
                  expandedRows={expandedRows}
                  onToggleRowExpand={toggleRowExpand}
                  onRowEdit={onRowEdit}
                />
              </>
            )}
          </Table>
        </div>
        {pagination && (
          <DataGridPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        )}
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
      />
    </>
  );
};

export { DataGrid as default };
