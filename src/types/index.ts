export type Category =
  | 'good-year'
  | 'bridgestone'
  | 'yokohama'
  | 'continental'
  | 'mrf'
  | 'michelin'
  | 'apollo'
  | 'jk-tyre'
  | 'ceat'
  | 'firestone'
  | 'pirelli';

export interface Service {
  id: string;
  name: string;
  price: number;
  image: string;
  hsn_code: string;
  category: Category;
  type?: 'tube' | 'tubeless';
  description?: string;
  stock?: number;
  discount_percentage?: number;
  gst_percentage?: number;
}

export interface CarModel {
  id: string;
  name: string;
  brand: string;
}

export interface BillItem {
  service: Service;
  quantity: number;
  selected: boolean;
  discountPercentage?: number;
}

export interface Bill {
  id: string;
  carModel: CarModel;
  services: BillItem[];
  total: number;
  gstPercentage: number;
  gstAmount: number;
  finalTotal: number;
  createdAt: Date;
}

export interface SavedBill {
  id: string;
  billNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  vehicleNumber: string;
  date: string;
  gstNumber: string;
  items: {
    description: string;
    hsnCode: string;
    quantity: number;
    rate: number;
    taxPercentage: number;
    amount: number;
    discountPercentage?: number;
  }[];
  total: number;
  gstAmount: number;
  sgst_amount?: number;
  cgst_amount?: number;
  netAmount: number;
  paymentMethod?: string;
  bill_items: any[];
}
