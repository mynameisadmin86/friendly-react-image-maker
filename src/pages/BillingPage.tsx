
import React, { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import BillingSearchForm from '@/components/billing/BillingSearchForm';
import BillingTable from '@/components/billing/BillingTable';
import BillingHeader from '@/components/billing/BillingHeader';
import { recentBills } from '@/data/mockBillingData';

const BillingPage = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="p-6">
      <Breadcrumb 
        items={[{ label: 'Quick Billing Management', href: '/billing' }]}
      />
      
      <BillingHeader title="Quick Billing Management" />
      
      <BillingSearchForm 
        isSearchExpanded={isSearchExpanded}
        setIsSearchExpanded={setIsSearchExpanded}
      />

      <BillingTable bills={recentBills} />
    </div>
  );
};

export default BillingPage;
