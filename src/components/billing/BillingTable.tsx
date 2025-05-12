
import React from 'react';
import { 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { DataGrid } from '@/components/ui/data-grid';

export interface BillItem {
  id: string;
  date: string;
  status: 'Under Amendment' | 'Fresh' | 'Confirmed';
  customerSupplier: string;
  customerSupplierRef: string;
  contractOrderType: string;
  contractOrderValue: string;
  totalNetAmount: string;
  billingType: string;
  billingQty: string;
  groupNetAmount: string;
  lineNo: string;
}

interface BillingTableProps {
  bills: BillItem[];
}

const BillingTable: React.FC<BillingTableProps> = ({ bills }) => {
  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
    // Implement search functionality
  };

  const handleFilter = () => {
    console.log('Filter clicked');
    // Implement filter functionality
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Implement export functionality
  };

  return (
    <DataGrid 
      title="Recent Bills"
      count={bills.length}
      onSearch={handleSearch}
      onFilter={handleFilter}
      onExport={handleExport}
    >
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
        {bills.map((bill) => (
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
    </DataGrid>
  );
};

export default BillingTable;
