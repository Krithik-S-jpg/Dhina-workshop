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
  { id: '1', name: 'Exterior Wash', price: 300, category: 'water-service', description: 'Complete exterior cleaning', image: '/images/water-service.jpg' },
  { id: '2', name: 'Interior Cleaning', price: 400, category: 'water-service', description: 'Deep interior cleaning', image: '/images/water-service.jpg' },
  { id: '3', name: 'Full Body Wash', price: 500, category: 'water-service', description: 'Complete car wash service', image: '/images/water-service.jpg' },
  { id: '4', name: 'Wax Coating', price: 700, category: 'water-service', description: 'Premium wax coating', image: '/images/water-service.jpg' },
  { id: '5', name: 'Foam Wash', price: 900, category: 'water-service', description: 'Luxury foam wash treatment', image: '/images/water-service.jpg' },
  { id: '6', name: 'Premium Wash', price: 1100, category: 'water-service', description: 'Ultimate premium service', image: '/images/water-service.jpg' },
  
  // Wheel Alignment
  { id: '7', name: 'Front Wheel Alignment', price: 800, category: 'wheel-alignment', description: 'Front wheels alignment service', image: '/images/wheel-alignment.jpg' },
  { id: '8', name: 'Full Wheel Alignment', price: 1200, category: 'wheel-alignment', description: 'Complete 4-wheel alignment', image: '/images/wheel-alignment.jpg' },
  { id: '9', name: 'Wheel Balancing', price: 600, category: 'wheel-alignment', description: 'Professional wheel balancing', image: '/images/wheel-alignment.jpg' },
  
  // Car Accessories
  { id: '10', name: 'Air Freshener', price: 150, category: 'car-accessories', description: 'Premium car air freshener', image: '/images/car-accessories.jpg' },
  { id: '11', name: 'Floor Mats', price: 500, category: 'car-accessories', description: 'High-quality floor mats', image: '/images/car-accessories.jpg' },
  { id: '12', name: 'Seat Covers', price: 1200, category: 'car-accessories', description: 'Premium seat covers', image: '/images/car-accessories.jpg' },
  
  // CNG/LPG Services
  { id: '13', name: 'CNG Kit Installation', price: 35000, category: 'cng-lpg', description: 'Complete CNG kit installation', image: '/images/cng-lpg.jpg' },
  { id: '14', name: 'LPG Kit Installation', price: 30000, category: 'cng-lpg', description: 'Complete LPG kit installation', image: '/images/cng-lpg.jpg' },
  { id: '15', name: 'CNG Cylinder Testing', price: 2000, category: 'cng-lpg', description: 'CNG cylinder safety testing', image: '/images/cng-lpg.jpg' },
  { id: '16', name: 'Gas Leak Check', price: 500, category: 'cng-lpg', description: 'Complete gas system leak check', image: '/images/cng-lpg.jpg' },
  
  // A/C Services
  { id: '17', name: 'A/C Gas Refill', price: 1500, category: 'ac-service', description: 'Complete A/C gas refill service', image: '/images/ac-service.jpg' },
  { id: '18', name: 'A/C Filter Replacement', price: 800, category: 'ac-service', description: 'Replace A/C cabin filter', image: '/images/ac-service.jpg' },
  { id: '19', name: 'A/C Compressor Service', price: 3500, category: 'ac-service', description: 'A/C compressor repair service', image: '/images/ac-service.jpg' },
  { id: '20', name: 'A/C Complete Service', price: 2500, category: 'ac-service', description: 'Complete A/C system service', image: '/images/ac-service.jpg' },
];

export const defaultGstPercentage = 18;