
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ChevronDown } from 'lucide-react';

interface SearchCardProps {
  title?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSearch?: () => void;
  onClear?: () => void;
  children: React.ReactNode;
}

const SearchCard: React.FC<SearchCardProps> = ({ 
  title = "Search",
  isExpanded, 
  onToggleExpand,
  onSearch,
  onClear,
  children 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Search size={18} />
          {title}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleExpand}
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? '' : 'transform rotate-180'}`} />
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pb-4">
          {children}
          
          <div className="flex justify-end gap-3 mt-4">
            {onClear && (
              <Button variant="outline" onClick={onClear}>Clear Search</Button>
            )}
            {onSearch && (
              <Button 
                className="bg-logistics-blue hover:bg-logistics-blue-hover"
                onClick={onSearch}
              >
                Search
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export { SearchCard };
