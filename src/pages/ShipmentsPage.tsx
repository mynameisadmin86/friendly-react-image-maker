
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Breadcrumb from '@/components/Breadcrumb';
import StatusBadge from '@/components/StatusBadge';
import { Package } from 'lucide-react';
import { SearchCard } from '@/components/ui/search-card';
import { DataGrid } from '@/components/ui/data-grid';

// Mock data
const shipments = [
  {
    id: 'SHP-00001',
    date: '14/05/2024',
    status: 'Processing' as const,
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
    status: 'Completed' as const,
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
    status: 'Fresh' as const,
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
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

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
        count={shipments.length}
        onSearch={handleTableSearch}
        onFilter={handleFilter}
        onExport={handleExport}
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            </TableHead>
            <TableHead>Shipment ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Origin/Destination</TableHead>
            <TableHead>Type/Weight</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>ETA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm">{shipment.id}</div>
                <div className="text-xs text-gray-500">{shipment.date}</div>
              </TableCell>
              <TableCell>
                <StatusBadge status={shipment.status} />
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm">{shipment.origin}</div>
                <div className="text-xs text-gray-500">{shipment.destination}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm">{shipment.type}</div>
                <div className="text-xs text-gray-500">{shipment.weight}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm">{shipment.customer}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm">{shipment.eta}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataGrid>
    </div>
  );
};

export default ShipmentsPage;
