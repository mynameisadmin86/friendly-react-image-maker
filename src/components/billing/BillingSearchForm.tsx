
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ChevronDown } from 'lucide-react';

interface BillingSearchFormProps {
  isSearchExpanded: boolean;
  setIsSearchExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillingSearchForm: React.FC<BillingSearchFormProps> = ({ 
  isSearchExpanded, 
  setIsSearchExpanded 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Search size={18} />
          Search
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${isSearchExpanded ? '' : 'transform rotate-180'}`} />
        </Button>
      </CardHeader>
      
      {isSearchExpanded && (
        <CardContent className="pb-4">
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
          
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline">Clear Search</Button>
            <Button className="bg-logistics-blue hover:bg-logistics-blue-hover">Search</Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BillingSearchForm;
