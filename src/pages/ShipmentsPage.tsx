import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchCard } from '@/components/ui/search-card';
import { DataGrid, SortState, Column } from '@/components/ui/data-grid';
import Breadcrumb from '@/components/Breadcrumb';
import StatusBadge from '@/components/StatusBadge';
import { Package } from 'lucide-react';

// Mock data for shipment items
interface ShipmentItem {
  id: string;
  date: string;
  status: 'Processing' | 'Completed' | 'Fresh';
  origin: string;
  destination: string;
  type: string;
  weight: string;
  customer: string;
  eta: string;
}

// Mock data
const initialShipments: ShipmentItem[] = [
  {
    id: 'SHP-00001',
    date: '14/05/2024',
    status: 'Processing',
    origin: 'Hamburg, DE',
    destination: 'Rotterdam, NL',
    type: 'Container',
    weight: '12,500 kg',
    customer: 'DB Cargo',
    eta: '16/05/2024'
  },
  {
    id: 'SHP-00002',
    date: '13/05/2024',
    status: 'Completed',
    origin: 'Berlin, DE',
    destination: 'Paris, FR',
    type: 'Bulk',
    weight: '8,300 kg',
    customer: 'Maersk',
    eta: '15/05/2024'
  },
  {
    id: 'SHP-00003',
    date: '12/05/2024',
    status: 'Fresh',
    origin: 'Munich, DE',
    destination: 'Vienna, AT',
    type: 'Container',
    weight: '9,800 kg',
    customer: 'Orits Group',
    eta: '14/05/2024'
  }
];

const ShipmentsPage = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [shipments, setShipments] = useState(initialShipments);
  const [filteredShipments, setFilteredShipments] = useState(initialShipments);
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirstItem, indexOfLastItem);
  
  useEffect(() => {
    setFilteredShipments(shipments);
  }, [shipments]);
  
  const handleToggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearch = () => {
    console.log('Searching shipments');
  };

  const handleClearSearch = () => {
    console.log('Clearing shipment search');
  };

  const handleTableSearch = (value: string) => {
    console.log('Table search:', value);
    
    if (value.trim() === '') {
      setFilteredShipments(shipments);
    } else {
      const lowercasedValue = value.toLowerCase();
      const filtered = shipments.filter(shipment => 
        shipment.id.toLowerCase().includes(lowercasedValue) ||
        shipment.origin.toLowerCase().includes(lowercasedValue) ||
        shipment.destination.toLowerCase().includes(lowercasedValue) ||
        shipment.customer.toLowerCase().includes(lowercasedValue)
      );
      setFilteredShipments(filtered);
    }
    setCurrentPage(1);
  };

  const handleFilter = (filters: any) => {
    console.log('Filters applied:', filters);
    
    let filtered = [...shipments];
    
    if (filters.origin) {
      filtered = filtered.filter(shipment => 
        shipment.origin.toLowerCase().includes(filters.origin.toLowerCase())
      );
    }
    
    if (filters.destination) {
      filtered = filtered.filter(shipment => 
        shipment.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(shipment => 
        shipment.type === filters.type
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(shipment => 
        shipment.status === filters.status
      );
    }
    
    setFilteredShipments(filtered);
    setCurrentPage(1);
  };

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState);
    
    if (newSortState.direction === null) {
      setFilteredShipments([...shipments]);
      return;
    }
    
    const column = newSortState.column as keyof ShipmentItem;
    const direction = newSortState.direction;
    
    const sortedShipments = [...filteredShipments].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredShipments(sortedShipments);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting as ${format}`);
    alert(`Exporting data as ${format.toUpperCase()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowEdit = (rowIndex: number, key: string, value: any) => {
    console.log(`Editing row ${rowIndex}, field ${key} to value: ${value}`);
    
    const newShipments = [...filteredShipments];
    const actualIndex = indexOfFirstItem + rowIndex;
    
    if (newShipments[actualIndex] && key in newShipments[actualIndex]) {
      (newShipments[actualIndex] as any)[key] = value;
      setFilteredShipments(newShipments);
    }
  };

  const filterFields = [
    { name: 'origin', label: 'Origin', type: 'text' as const },
    { name: 'destination', label: 'Destination', type: 'text' as const },
    { 
      name: 'type', 
      label: 'Shipment Type', 
      type: 'select' as const,
      options: [
        { label: 'Container', value: 'Container' },
        { label: 'Bulk', value: 'Bulk' }
      ]
    },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select' as const,
      options: [
        { label: 'Processing', value: 'Processing' },
        { label: 'Fresh', value: 'Fresh' },
        { label: 'Completed', value: 'Completed' }
      ]
    }
  ];

  // Define columns for the DataGrid
  const columns: Column[] = [
    { 
      key: 'id', 
      header: 'Shipment ID',
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
      cell: (value) => <StatusBadge status={value} />
    },
    { 
      key: 'origin', 
      header: 'Origin/Destination',
      isEditable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.destination}</div>
        </div>
      )
    },
    { 
      key: 'type', 
      header: 'Type/Weight',
      isEditable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.weight}</div>
        </div>
      )
    },
    { 
      key: 'customer', 
      header: 'Customer',
      isEditable: true
    },
    { 
      key: 'eta', 
      header: 'ETA',
      isEditable: true 
    }
  ];

  return (
    <div className="p-6">
      <Breadcrumb 
        items={[{ label: 'Shipments Management', href: '/shipments' }]}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Shipments Management</h1>
        <div className="flex gap-3">
          <Button className="bg-logistics-blue hover:bg-logistics-blue-hover">
            Create Shipment
          </Button>
        </div>
      </div>

      {/* Search Card */}
      <SearchCard
        title="Shipment Search"
        isExpanded={isSearchExpanded}
        onToggleExpand={handleToggleSearch}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Origin</label>
            <Input placeholder="Enter origin location" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <Input placeholder="Enter destination location" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Shipment ID</label>
            <Input placeholder="Enter shipment ID" />
          </div>
        </div>
      </SearchCard>

      {/* Shipments Table */}
      <DataGrid
        title={
          <div className="flex items-center gap-2">
            <Package size={20} />
            Shipments
          </div>
        }
        count={filteredShipments.length}
        columns={columns}
        data={currentShipments}
        onSearch={handleTableSearch}
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
    </div>
  );
};

export default ShipmentsPage;
