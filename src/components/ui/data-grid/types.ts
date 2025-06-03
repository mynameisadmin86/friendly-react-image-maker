
import React from 'react';

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
  filterable?: boolean; // Whether column is filterable
  filterType?: 'text' | 'select' | 'date'; // Type of filter input
  filterOptions?: { label: string; value: string }[]; // Options for select filter
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
  onImport?: (data: any[]) => void;
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
  maxVisibleColumns?: number;
  mandatoryColumns?: string[];
}

export interface EditableCellProps {
  value: any;
  rowIndex: number;
  columnKey: string;
  isEditable: boolean;
  onEdit: (rowIndex: number, columnKey: string, value: any) => void;
}
