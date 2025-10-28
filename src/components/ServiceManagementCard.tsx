import React from 'react';
import { Service } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface ServiceManagementCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const categoryImages = {
    'wheel-alignment': 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=500',
    'water-service': 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500',
    'car-accessories': 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500',
    'cng-lpg': 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=500',
    'ac-service': 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=500',
};

export function ServiceManagementCard({ service, onEdit, onDelete }: ServiceManagementCardProps) {
  const imageUrl = categoryImages[service.category];
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48">
        <img src={imageUrl} alt={service.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-800 truncate">{service.name}</h3>
        <p className="text-sm text-slate-600">{service.description}</p>
        <p className="text-lg font-bold text-slate-900 mt-2">₹{service.price}</p>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(service)}
          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
          aria-label={`Edit ${service.name}`}
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
          aria-label={`Delete ${service.name}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}