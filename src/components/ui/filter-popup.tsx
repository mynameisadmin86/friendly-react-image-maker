
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: { label: string; value: string }[];
}

interface FilterPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FilterField[];
  onApplyFilter: (filters: Record<string, any>) => void;
  triggerElement: React.ReactNode;
}

export const FilterPopup: React.FC<FilterPopupProps> = ({
  isOpen,
  onOpenChange,
  fields,
  onApplyFilter,
  triggerElement,
}) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filterValues);
  };

  const handleClearFilter = () => {
    setFilterValues({});
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {triggerElement}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4 p-2">
          <h3 className="font-medium text-sm">Filter</h3>
          
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </label>
                
                {field.type === 'text' && (
                  <Input
                    id={field.name}
                    value={filterValues[field.name] || ''}
                    onChange={(e) => handleFilterChange(field.name, e.target.value)}
                    placeholder={`Filter by ${field.label.toLowerCase()}`}
                  />
                )}
                
                {field.type === 'select' && field.options && (
                  <Select
                    value={filterValues[field.name] || ''}
                    onValueChange={(value) => handleFilterChange(field.name, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {field.type === 'date' && (
                  <Input
                    id={field.name}
                    type="date"
                    value={filterValues[field.name] || ''}
                    onChange={(e) => handleFilterChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilter}
            >
              Reset
            </Button>
            <Button 
              size="sm"
              className="bg-logistics-blue hover:bg-logistics-blue-hover" 
              onClick={handleApplyFilter}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
