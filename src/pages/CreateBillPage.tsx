
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
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumb from '@/components/Breadcrumb';
import { Calendar, Info, Search } from 'lucide-react';

const CreateBillPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb 
        items={[
          { label: 'Quick Billing Management', href: '/billing' },
          { label: 'Create Quick Billing', href: '/billing/create' }
        ]}
      />

      <h1 className="text-2xl font-semibold mb-6">Quick Billing</h1>

      <div className="flex gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-logistics-blue flex items-center justify-center text-white font-medium">
          1
        </div>
        <div>
          <h2 className="text-lg font-medium">Basic Details</h2>
          <p className="text-sm text-gray-500">Required</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex gap-4 mb-4">
                <Button variant="outline" className="flex-1 border-2 border-logistics-blue text-logistics-blue">
                  Sell Order
                </Button>
                <Button variant="outline" className="flex-1">
                  Buy Order
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Internal Order Date</label>
                  <div className="relative">
                    <Input type="text" value="24/06/2024" className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contract</label>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer/Vendor</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="DB Cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="db">DB Cargo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">UIC (Handover)</label>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select UIC" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uic1">UIC 1</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Enter Value" className="w-32" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                <Input placeholder="Enter Summary" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Internal Order No.</label>
              <div className="flex gap-2">
                <Input placeholder="9000000000042" className="flex-1" />
                <Button variant="outline" size="icon" className="shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-6 text-gray-500">
            <Info className="h-5 w-5 mr-2" />
            <span className="text-sm">More Info</span>
          </div>

          <div className="border-t mt-8 pt-6">
            <h3 className="text-lg font-medium mb-4">Document and Reference Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Doc Type and No.</label>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Headload" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headload">Headload</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="PR/2234/2023" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Doc Date</label>
                <div className="relative">
                  <Input type="text" value="12/03/2023" className="pl-10" />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer/ Supplier Ref. No.</label>
                <div className="flex gap-2">
                  <Input placeholder="Enter Customer/Supplier Ref. No." className="flex-1" />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline">Cancel</Button>
            <div className="flex gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button className="bg-logistics-blue hover:bg-logistics-blue-hover">Continue</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center opacity-50">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          2
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-medium">Resource Group Details</h2>
          <p className="text-sm text-gray-500">Total Groups: 0</p>
        </div>
      </div>
      
      <div className="flex items-center opacity-50 mt-8">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          3
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-medium">Rate and Actual Details</h2>
          <p className="text-sm text-gray-500">Billing Qty: TOD.O</p>
        </div>
      </div>
      
      <div className="flex items-center opacity-50 mt-8">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          4
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-medium">Review Summary</h2>
          <p className="text-sm text-gray-500">Bill Amount: € 0.00</p>
        </div>
      </div>
    </div>
  );
};

export default CreateBillPage;
