import React, { useState, useEffect } from 'react';
import { 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { DataGrid, SortableHeader, SortState, Column } from '@/components/ui/data-grid';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setFilteredBills(bills);
    setCurrentPage(1);
  }, [bills]);

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
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Export as ${format} clicked`);
    alert(`Exporting data as ${format.toUpperCase()}`);
  };

  const handleSort = (sortState: SortState) => {
    setSortState(sortState);
    
    if (sortState.direction === null) {
      setFilteredBills([...bills]);
      return;
    }
    
    const column = sortState.column as keyof BillItem;
    const direction = sortState.direction;
    
    const sortedBills = [...filteredBills].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredBills(sortedBills);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowEdit = (rowIndex: number, key: string, value: any) => {
    console.log(`Editing row ${rowIndex}, field ${key} to value: ${value}`);
    
    const newBills = [...filteredBills];
    const actualIndex = indexOfFirstItem + rowIndex;
    
    if (newBills[actualIndex] && key in newBills[actualIndex]) {
      (newBills[actualIndex] as any)[key] = value;
      setFilteredBills(newBills);
    }
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

  // Define dynamic columns - all columns are now editable by default
  const columns: Column[] = [
    { 
      key: 'id', 
      header: 'Quick Billing No.',
      isEditable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.date}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      isEditable: true,
      cell: (value) => <StatusBadge status={value} />
    },
    { 
      key: 'customerSupplier', 
      header: 'Customer/Supplier',
      isEditable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.customerSupplierRef}</div>
        </div>
      )
    },
    { 
      key: 'contractOrderType', 
      header: 'Contract Order Type',
      isEditable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.contractOrderValue}</div>
        </div>
      )
    },
    { 
      key: 'totalNetAmount', 
      header: 'Total Net Amount',
      isEditable: true
    },
    { 
      key: 'billingType', 
      header: 'Billing Type',
      isEditable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.billingQty}</div>
        </div>
      )
    },
    { 
      key: 'groupNetAmount', 
      header: 'Group Net Amount',
      isEditable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.lineNo}</div>
        </div>
      )
    }
  ];

  return (
    <DataGrid 
      title="Recent Bills"
      count={filteredBills.length}
      columns={columns}
      data={currentBills}
      onSearch={handleSearch}
      onFilter={handleFilter}
      onExport={handleExport}
      onSortChange={handleSort}
      filterFields={filterFields}
      pagination={{
        currentPage,
        totalPages,
        onPageChange: handlePageChange
      }}
      onRowEdit={handleRowEdit}
    />
  );
};

export default BillingTable;
