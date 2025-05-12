
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { Search, Filter, Download } from 'lucide-react';

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
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          Recent Bills
          <span className="bg-logistics-blue text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">{bills.length}</span>
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
        </Table>
      </Card>
    </>
  );
};

export default BillingTable;
