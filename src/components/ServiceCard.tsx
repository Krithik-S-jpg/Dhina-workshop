import React from 'react';
import { Wrench, Droplets, Package, Fuel, Snowflake } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  image: string;
  onClick: () => void;
  category: 'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service';
}

const categoryIcons = {
  'wheel-alignment': Wrench,
  'water-service': Droplets,
  'car-accessories': Package,
  'cng-lpg': Fuel,
  'ac-service': Snowflake,
};

export function ServiceCard({ title, image, onClick, category }: ServiceCardProps) {
  const Icon = categoryIcons[category];
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 text-center">{title}</h3>
      </div>
    </div>
  );
}