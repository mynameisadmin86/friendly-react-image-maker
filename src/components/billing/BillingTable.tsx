
import React, { useState, useEffect } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { DataGrid, SortState, Column } from '@/components/ui/data-grid';
import { toast } from 'sonner';

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

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting data as ${format.toUpperCase()}`);
  };

  const handleImport = (importedData: any[]) => {
    // In a real app, this would validate and process the imported data
    console.log('Imported data:', importedData);
    toast.success(`Imported ${importedData.length} records`);
    
    // For demo purposes, let's just append the imported data
    setFilteredBills(prev => [...prev, ...importedData]);
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
      toast.success(`Updated ${key} to "${value}"`);
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

  // Define columns with enhanced features
  const columns: Column[] = [
    { 
      key: 'id', 
      header: 'Billing #',
      isEditable: false, // First column not editable by default
      width: 15,
      priority: 1,
      sequence: 1,
      mandatory: true, // Can't be hidden
      filterable: true,
      filterType: 'text',
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
      width: 10,
      priority: 1,
      sequence: 2,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Under Amendment', value: 'Under Amendment' },
        { label: 'Fresh', value: 'Fresh' },
        { label: 'Confirmed', value: 'Confirmed' }
      ],
      cell: (value) => <StatusBadge status={value} />
    },
    { 
      key: 'customerSupplier', 
      header: 'Customer',
      isEditable: true,
      width: 15,
      priority: 1,
      sequence: 3,
      filterable: true,
      filterType: 'text',
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.customerSupplierRef}</div>
        </div>
      )
    },
    { 
      key: 'contractOrderType', 
      header: 'Contract Type',
      isEditable: true,
      width: 15,
      priority: 2,
      sequence: 4,
      filterable: true,
      filterType: 'text',
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.contractOrderValue}</div>
        </div>
      )
    },
    { 
      key: 'totalNetAmount', 
      header: 'Total Net',
      isEditable: true,
      width: 10,
      priority: 3,
      sequence: 5,
      filterable: true,
      filterType: 'text'
    },
    { 
      key: 'billingType', 
      header: 'Billing Type',
      isEditable: true,
      width: 15,
      priority: 6,
      sequence: 6,
      filterable: true,
      filterType: 'text',
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.billingQty}</div>
        </div>
      )
    },
    { 
      key: 'groupNetAmount', 
      header: 'Group Net',
      isEditable: true,
      width: 10,
      priority: 7,
      sequence: 7,
      filterable: true,
      filterType: 'text'
    },
    { 
      key: 'lineNo', 
      header: 'Line #',
      isEditable: true,
      width: 10,
      priority: 8,
      sequence: 8,
      filterable: true,
      filterType: 'text'
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
      onImport={handleImport}
      onSortChange={handleSort}
      filterFields={filterFields}
      pagination={{
        currentPage,
        totalPages,
        onPageChange: handlePageChange
      }}
      onRowEdit={handleRowEdit}
      defaultEditable={true}
      maxVisibleColumns={5} // Show maximum 5 columns before nesting
      mandatoryColumns={['id']} // 'id' column is mandatory and can't be hidden
    />
  );
};

export default BillingTable;
