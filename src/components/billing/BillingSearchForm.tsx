
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchCard } from '@/components/ui/search-card';

interface BillingSearchFormProps {
  isSearchExpanded: boolean;
  setIsSearchExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillingSearchForm: React.FC<BillingSearchFormProps> = ({ 
  isSearchExpanded, 
  setIsSearchExpanded 
}) => {
  const handleToggleExpand = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleClearSearch = () => {
    // Add logic to clear form fields
    console.log('Clearing search form');
  };

  const handleSearch = () => {
    // Add logic to perform search
    console.log('Performing search');
  };

  return (
    <SearchCard
      isExpanded={isSearchExpanded}
      onToggleExpand={handleToggleExpand}
      onClear={handleClearSearch}
      onSearch={handleSearch}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Order Type</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Order Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Supplier</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Supplier Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supplier1">Supplier 1</SelectItem>
              <SelectItem value="supplier2">Supplier 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Contract/Customer Contract</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="DB Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="db">DB Cargo</SelectItem>
              <SelectItem value="maersk">Maersk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cluster</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Intermodal ( 10-00040-8 )" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intermodal">Intermodal ( 10-00040-8 )</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Customer</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Customer Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer1">Customer 1</SelectItem>
              <SelectItem value="customer2">Customer 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Customer/Supplier Reference No.</label>
          <Input placeholder="Enter Reference No." />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Draft Bill No.</label>
          <Input placeholder="Enter Bill No." />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Departure Point</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Departure Point" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="point1">Point 1</SelectItem>
              <SelectItem value="point2">Point 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SearchCard>
  );
};

export default BillingSearchForm;
