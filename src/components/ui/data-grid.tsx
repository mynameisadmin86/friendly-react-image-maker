
import React from 'react';
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
import { Filter, Download } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';

interface DataGridProps {
  title?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  onExport?: () => void;
  showToolbar?: boolean;
}

const DataGrid = ({
  title,
  count,
  children,
  onSearch,
  onFilter,
  onExport,
  showToolbar = true,
}: DataGridProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) onSearch(e.target.value);
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
            <SearchBar onChange={handleSearchChange} />
            {onFilter && (
              <Button variant="outline" size="icon" onClick={onFilter}>
                <Filter className="h-4 w-4" />
              </Button>
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

export { DataGrid };
