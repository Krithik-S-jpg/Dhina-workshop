import { Service, CarModel } from '../types';

export const carModels: CarModel[] = [
  { id: '1', name: 'Honda City', brand: 'Honda' },
  { id: '2', name: 'Toyota Camry', brand: 'Toyota' },
  { id: '3', name: 'BMW X5', brand: 'BMW' },
  { id: '4', name: 'Audi A4', brand: 'Audi' },
  { id: '5', name: 'Mercedes C-Class', brand: 'Mercedes' },
];

export const initialServices: Service[] = [
  // Water Services
  { id: '1', name: 'Exterior Wash', price: 300, hsnCode: '9987', category: 'water-service', description: 'Complete exterior cleaning' },
  { id: '2', name: 'Interior Cleaning', price: 400, hsnCode: '9987', category: 'water-service', description: 'Deep interior cleaning' },
  { id: '3', name: 'Full Body Wash', price: 500, hsnCode: '9987', category: 'water-service', description: 'Complete car wash service' },
  { id: '4', name: 'Wax Coating', price: 700, hsnCode: '9987', category: 'water-service', description: 'Premium wax coating' },
  { id: '5', name: 'Foam Wash', price: 900, hsnCode: '9987', category: 'water-service', description: 'Luxury foam wash treatment' },
  { id: '6', name: 'Premium Wash', price: 1100, hsnCode: '9987', category: 'water-service', description: 'Ultimate premium service' },
  
  // Wheel Alignment
  { id: '7', name: 'Front Wheel Alignment', price: 800, hsnCode: '9987', category: 'wheel-alignment', description: 'Front wheels alignment service' },
  { id: '8', name: 'Full Wheel Alignment', price: 1200, hsnCode: '9987', category: 'wheel-alignment', description: 'Complete 4-wheel alignment' },
  { id: '9', name: 'Wheel Balancing', price: 600, hsnCode: '9987', category: 'wheel-alignment', description: 'Professional wheel balancing' },
  
  // Car Accessories
  { id: '10', name: 'Air Freshener', price: 150, hsnCode: '9987', category: 'car-accessories', description: 'Premium car air freshener' },
  { id: '11', name: 'Floor Mats', price: 500, hsnCode: '9987', category: 'car-accessories', description: 'High-quality floor mats' },
  { id: '12', name: 'Seat Covers', price: 1200, hsnCode: '9987', category: 'car-accessories', description: 'Premium seat covers' },
  
  // CNG/LPG Services
  { id: '13', name: 'CNG Kit Installation', price: 35000, hsnCode: '9987', category: 'cng-lpg', description: 'Complete CNG kit installation' },
  { id: '14', name: 'LPG Kit Installation', price: 30000, hsnCode: '9987', category: 'cng-lpg', description: 'Complete LPG kit installation' },
  { id: '15', name: 'CNG Cylinder Testing', price: 2000, hsnCode: '9987', category: 'cng-lpg', description: 'CNG cylinder safety testing' },
  { id: '16', name: 'Gas Leak Check', price: 500, hsnCode: '9987', category: 'cng-lpg', description: 'Complete gas system leak check' },
  
  // A/C Services
  { id: '17', name: 'A/C Gas Refill', price: 1500, hsnCode: '9987', category: 'ac-service', description: 'Complete A/C gas refill service' },
  { id: '18', name: 'A/C Filter Replacement', price: 800, hsnCode: '9987', category: 'ac-service', description: 'Replace A/C cabin filter' },
  { id: '19', name: 'A/C Compressor Service', price: 3500, hsnCode: '9987', category: 'ac-service', description: 'A/C compressor repair service' },
  { id: '20', name: 'A/C Complete Service', price: 2500, hsnCode: '9987', category: 'ac-service', description: 'Complete A/C system service' },
];

export const defaultGstPercentage = 18;