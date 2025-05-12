
import React, { useState } from 'react';
import { 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { DataGrid, SortableHeader, SortState } from '@/components/ui/data-grid';

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
  const [filteredBills, setFilteredBills] = useState<BillItem[]>(bills);
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });

  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
    if (value.trim() === '') {
      setFilteredBills(bills);
    } else {
      const lowercasedValue = value.toLowerCase();
      const filtered = bills.filter(bill => 
        bill.id.toLowerCase().includes(lowercasedValue) ||
        bill.customerSupplier.toLowerCase().includes(lowercasedValue) ||
        bill.customerSupplierRef.toLowerCase().includes(lowercasedValue)
      );
      setFilteredBills(filtered);
    }
  };

  const handleFilter = (filters: any) => {
    console.log('Filter applied:', filters);
    let filtered = [...bills];
    
    if (filters.status) {
      filtered = filtered.filter(bill => bill.status === filters.status);
    }
    
    if (filters.contractType) {
      filtered = filtered.filter(bill => 
        bill.contractOrderType.toLowerCase() === filters.contractType.toLowerCase()
      );
    }
    
    setFilteredBills(filtered);
  };

  const handleExport = () => {
    console.log('Export clicked');
    alert('Export functionality would download data as CSV/Excel');
  };

  const handleSort = (column: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortState.column === column) {
      if (sortState.direction === 'asc') {
        direction = 'desc';
      } else if (sortState.direction === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }
    
    setSortState({ column, direction });
    
    // Sort the data
    if (direction === null) {
      setFilteredBills([...bills]);
      return;
    }
    
    const sortedBills = [...filteredBills].sort((a: any, b: any) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredBills(sortedBills);
  };

  const filterFields = [
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select' as const,
      options: [
        { label: 'Under Amendment', value: 'Under Amendment' },
        { label: 'Fresh', value: 'Fresh' },
        { label: 'Confirmed', value: 'Confirmed' }
      ]
    },
    { name: 'customerSupplier', label: 'Customer/Supplier', type: 'text' as const },
    { name: 'contractType', label: 'Contract Type', type: 'text' as const }
  ];

  return (
    <DataGrid 
      title="Recent Bills"
      count={filteredBills.length}
      onSearch={handleSearch}
      onFilter={handleFilter}
      onExport={handleExport}
      filterFields={filterFields}
    >
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
          </TableHead>
          <TableHead>
            <SortableHeader 
              column="id" 
              currentSort={sortState} 
              onSort={handleSort}
            >
              Quick Billing No. Date
            </SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader 
              column="status" 
              currentSort={sortState} 
              onSort={handleSort}
            >
              Status
            </SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader 
              column="customerSupplier" 
              currentSort={sortState} 
              onSort={handleSort}
            >
              Customer/Supplier Ref. No.
            </SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader 
              column="contractOrderType" 
              currentSort={sortState} 
              onSort={handleSort}
            >
              Contract Order Type
            </SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader 
              column="totalNetAmount" 
              currentSort={sortState} 
              onSort={handleSort}
            >
              Total Net Amount
            </SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader 
              column="billingType" 
              currentSort={sortState} 
              onSort={handleSort}
            >
              Billing Type Qty
            </SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader 
              column="groupNetAmount" 
              currentSort={sortState} 
              onSort={handleSort}
            >
              Group Net Amount Line No.
            </SortableHeader>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredBills.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              No bills found
            </TableCell>
          </TableRow>
        ) : (
          filteredBills.map((bill) => (
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
          ))
        )}
      </TableBody>
    </DataGrid>
  );
};

export default BillingTable;
