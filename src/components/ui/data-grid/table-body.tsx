
import React from 'react';
import { TableBody, TableCell, TableRow, TableNestedRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { EditableCell } from './editable-cell';
import { Column } from './types';

interface DataGridTableBodyProps {
  filteredData: any[];
  paginatedData: any[];
  mainColumns: Column[];
  nestedColumns: Column[];
  hasNestedColumns: boolean;
  expandedRows: Record<number, boolean>;
  onToggleRowExpand: (rowIndex: number) => void;
  onRowEdit?: (rowIndex: number, key: string, value: any) => void;
}

export const DataGridTableBody: React.FC<DataGridTableBodyProps> = ({
  filteredData,
  paginatedData,
  mainColumns,
  nestedColumns,
  hasNestedColumns,
  expandedRows,
  onToggleRowExpand,
  onRowEdit
}) => {
  console.log('DataGridTableBody rendered with', paginatedData?.length, 'items');

  if (filteredData.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={hasNestedColumns ? mainColumns.length + 1 : mainColumns.length} className="h-24 text-center">
            No data found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {paginatedData?.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <TableRow className="group">
            {hasNestedColumns && (
              <TableCell className="w-[120px] min-w-[120px] px-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                  onClick={() => onToggleRowExpand(rowIndex)}
                >
                  {expandedRows[rowIndex] ? (
                    <ChevronDown className="h-4 w-4" aria-label="Collapse row" />
                  ) : (
                    <ChevronRight className="h-4 w-4" aria-label="Expand row" />
                  )}
                </Button>
              </TableCell>
            )}
            
            {mainColumns.map((column) => (
              <TableCell 
                key={column.key}
                style={{ 
                  width: column.width ? `${column.width}%` : 'auto',
                  minWidth: '120px'
                }}
              >
                {column.cell ? column.cell(row[column.key], row) : (
                  onRowEdit && column.isEditable ? (
                    <EditableCell
                      value={row[column.key]}
                      rowIndex={rowIndex}
                      columnKey={column.key}
                      isEditable={Boolean(column.isEditable)}
                      onEdit={onRowEdit}
                    />
                  ) : (
                    <span className="text-sm">{row[column.key]}</span>
                  )
                )}
              </TableCell>
            ))}
          </TableRow>
          
          {hasNestedColumns && (
            <TableNestedRow isOpen={Boolean(expandedRows[rowIndex])}>
              <TableCell colSpan={mainColumns.length + 1}>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-8 bg-muted/10 border-l-4 border-l-primary/20">
                  {nestedColumns.map((column) => (
                    <div key={column.key} className="flex flex-col space-y-2 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {column.header}
                        </span>
                        {column.mandatory && (
                          <CheckCircle2 className="inline h-3 w-3 text-green-500" aria-label="Mandatory column" />
                        )}
                      </div>
                      <div className="min-w-0">
                        {column.cell ? column.cell(row[column.key], row) : (
                          onRowEdit && column.isEditable ? (
                            <EditableCell
                              value={row[column.key]}
                              rowIndex={rowIndex}
                              columnKey={column.key}
                              isEditable={Boolean(column.isEditable)}
                              onEdit={onRowEdit}
                            />
                          ) : (
                            <span className="text-sm break-words">{row[column.key]}</span>
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
      ))}
    </TableBody>
  );
};
