
import React, { useState } from 'react';
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import Breadcrumb from '@/components/Breadcrumb';
import StatusBadge from '@/components/StatusBadge';
import { FileText, Filter, Search, ChevronDown, Download } from 'lucide-react';

// Mock data
const recentBills = [
  {
    id: 'QB/00001/2023',
    date: '12/03/2023',
    status: 'Under Amendment' as const,
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  },
  {
    id: 'QB/00001/2024',
    date: '12/03/2024',
    status: 'Fresh' as const,
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  },
  {
    id: 'QB/00001/2027',
    date: '12/03/2024',
    status: 'Confirmed' as const,
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  },
  {
    id: 'QB/00001/2028',
    date: '12/03/2024',
    status: 'Fresh' as const,
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  }
];

const BillingPage = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="p-6">
      <Breadcrumb 
        items={[{ label: 'Quick Billing Management', href: '/billing' }]}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Quick Billing Management</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText size={18} />
            CIMC/CUV Report
          </Button>
          <Button className="bg-logistics-blue hover:bg-logistics-blue-hover">
            Create Bill
          </Button>
        </div>
      </div>

      {/* Search Form */}
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

      {/* Recent Bills */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          Recent Bills
          <span className="bg-logistics-blue text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">4</span>
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search" className="pl-9 w-48" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              </TableHead>
              <TableHead>Quick Billing No. Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer/Supplier Ref. No.</TableHead>
              <TableHead>Contract Order Type</TableHead>
              <TableHead>Total Net Amount</TableHead>
              <TableHead>Billing Type Qty</TableHead>
              <TableHead>Group Net Amount Line No.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{bill.id}</div>
                  <div className="text-xs text-gray-500">{bill.date}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={bill.status} />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{bill.customerSupplier}</div>
                  <div className="text-xs text-gray-500">{bill.customerSupplierRef}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{bill.contractOrderType}</div>
                  <div className="text-xs text-gray-500">{bill.contractOrderValue}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{bill.totalNetAmount}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{bill.billingType}</div>
                  <div className="text-xs text-gray-500">{bill.billingQty}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{bill.groupNetAmount}</div>
                  <div className="text-xs text-gray-500">{bill.lineNo}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BillingPage;
