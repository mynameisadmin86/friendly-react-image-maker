
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Breadcrumb from '@/components/Breadcrumb';
import StatusBadge from '@/components/StatusBadge';
import { Search, Filter, Download, Package } from 'lucide-react';

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
      <Card className="mb-6">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <Search size={18} />
            Shipment Search
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pb-4">
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
          
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline">Clear Search</Button>
            <Button className="bg-logistics-blue hover:bg-logistics-blue-hover">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Package size={20} />
          Shipments
          <span className="bg-logistics-blue text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {shipments.length}
          </span>
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
        </Table>
      </Card>
    </div>
  );
};

export default ShipmentsPage;
