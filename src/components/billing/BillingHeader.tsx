
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

interface BillingHeaderProps {
  title: string;
}

const BillingHeader: React.FC<BillingHeaderProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <FileText size={18} />
          CIMC/CUV Report
        </Button>
        <Button className="bg-logistics-blue hover:bg-logistics-blue-hover" asChild>
          <Link to="/billing/create">Create Bill</Link>
        </Button>
      </div>
    </div>
  );
};

export default BillingHeader;
