export interface Service {
  id: string;
  name: string;
  price: number;
  image: string;
  hsn_code: string;
  category: 'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service';
  description?: string;
  stock?: number;
  old_stock?: number;
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

export interface Employee {
  id: string;
  name: string;
  role: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
  created_at?: string;
}