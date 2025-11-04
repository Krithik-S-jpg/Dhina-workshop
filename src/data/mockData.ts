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
  { id: '1', name: 'Exterior Wash', price: 300, hsnCode: '9987', category: 'water-service', description: 'Complete exterior cleaning', image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '2', name: 'Interior Cleaning', price: 400, hsnCode: '9987', category: 'water-service', description: 'Deep interior cleaning', image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '3', name: 'Full Body Wash', price: 500, hsnCode: '9987', category: 'water-service', description: 'Complete car wash service', image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '4', name: 'Wax Coating', price: 700, hsnCode: '9987', category: 'water-service', description: 'Premium wax coating', image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '5', name: 'Foam Wash', price: 900, hsnCode: '9987', category: 'water-service', description: 'Luxury foam wash treatment', image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '6', name: 'Premium Wash', price: 1100, hsnCode: '9987', category: 'water-service', description: 'Ultimate premium service', image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500' },

  // Wheel Alignment
  { id: '7', name: 'Front Wheel Alignment', price: 800, hsnCode: '9987', category: 'wheel-alignment', description: 'Front wheels alignment service', image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '8', name: 'Full Wheel Alignment', price: 1200, hsnCode: '9987', category: 'wheel-alignment', description: 'Complete 4-wheel alignment', image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '9', name: 'Wheel Balancing', price: 600, hsnCode: '9987', category: 'wheel-alignment', description: 'Professional wheel balancing', image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=500' },

  // Car Accessories
  { id: '10', name: 'Air Freshener', price: 150, hsnCode: '9987', category: 'car-accessories', description: 'Premium car air freshener', image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '11', name: 'Floor Mats', price: 500, hsnCode: '9987', category: 'car-accessories', description: 'High-quality floor mats', image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '12', name: 'Seat Covers', price: 1200, hsnCode: '9987', category: 'car-accessories', description: 'Premium seat covers', image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500' },

  // CNG/LPG Services
  { id: '13', name: 'CNG Kit Installation', price: 35000, hsnCode: '9987', category: 'cng-lpg', description: 'Complete CNG kit installation', image: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '14', name: 'LPG Kit Installation', price: 30000, hsnCode: '9987', category: 'cng-lpg', description: 'Complete LPG kit installation', image: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '15', name: 'CNG Cylinder Testing', price: 2000, hsnCode: '9987', category: 'cng-lpg', description: 'CNG cylinder safety testing', image: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '16', name: 'Gas Leak Check', price: 500, hsnCode: '9987', category: 'cng-lpg', description: 'Complete gas system leak check', image: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=500' },

  // A/C Services
  { id: '17', name: 'A/C Gas Refill', price: 1500, hsnCode: '9987', category: 'ac-service', description: 'Complete A/C gas refill service', image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '18', name: 'A/C Filter Replacement', price: 800, hsnCode: '9987', category: 'ac-service', description: 'Replace A/C cabin filter', image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '19', name: 'A/C Compressor Service', price: 3500, hsnCode: '9987', category: 'ac-service', description: 'A/C compressor repair service', image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: '20', name: 'A/C Complete Service', price: 2500, hsnCode: '9987', category: 'ac-service', description: 'Complete A/C system service', image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=500' },
];

export const defaultGstPercentage = 18;

export const serviceCategories = [
  { title: 'Wheel Alignment', image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'wheel-alignment' as const },
  { title: 'Water Service', image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'water-service' as const },
  { title: 'Car Accessories', image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'car-accessories' as const },
  { title: 'CNG/LPG Service', image: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'cng-lpg' as const },
  { title: 'A/C Service', image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'ac-service' as const },
];