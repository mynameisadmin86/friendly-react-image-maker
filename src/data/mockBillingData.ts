
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

// Mock data
export const recentBills: BillItem[] = [
  {
    id: 'QB/00001/2023',
    date: '12/03/2023',
    status: 'Under Amendment',
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  },
  {
    id: 'QB/00001/2024',
    date: '12/03/2024',
    status: 'Fresh',
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  },
  {
    id: 'QB/00001/2027',
    date: '12/03/2024',
    status: 'Confirmed',
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  },
  {
    id: 'QB/00001/2028',
    date: '12/03/2024',
    status: 'Fresh',
    customerSupplier: 'Orits Group',
    customerSupplierRef: 'CSR/11/2024',
    contractOrderType: 'AO Interbank',
    contractOrderValue: 'Wagon',
    totalNetAmount: '€ 1395.00',
    billingType: 'Wagon',
    billingQty: '12 Hrs',
    groupNetAmount: '€ 1000.00',
    lineNo: '401'
  }
];
