import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Service, CarModel } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultGstPercentage } from '../data/mockData';

interface ServiceSelectionProps {
  category: 'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service';
  services: Service[];
  carModels: CarModel[];
  onBack: () => void;
  onViewBill: (selectedServices: Service[], carModel: CarModel) => void;
}

const categoryTitles = {
  'wheel-alignment': 'Wheel Alignment',
  'water-service': 'Water Services',
  'car-accessories': 'Car Accessories',
  'cng-lpg': 'CNG/LPG Services',
  'ac-service': 'A/C Services',
};

export function ServiceSelection({ category, services, carModels, onBack, onViewBill }: ServiceSelectionProps) {
  const [selectedCarModel, setSelectedCarModel] = useState<CarModel>(carModels[0]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [gstPercentage] = useLocalStorage<number>('car-wash-gst', defaultGstPercentage);

  const categoryServices = services.filter(service => service.category === category);

  const handleServiceToggle = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleViewBill = () => {
    const selected = categoryServices.filter(service => selectedServices.has(service.id));
    onViewBill(selected, selectedCarModel);
  };

  const total = categoryServices
    .filter(service => selectedServices.has(service.id))
    .reduce((sum, service) => sum + service.price, 0);
  
  const gstAmount = (total * gstPercentage) / 100;
  const finalTotal = total + gstAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-700 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 mb-4 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Services</span>
          </button>
          <h1 className="text-3xl font-bold text-center">Car Wash Company</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <label className="block text-lg font-medium text-slate-700 mb-2">
              Select Car Model:
            </label>
            <select
              value={selectedCarModel.id}
              onChange={(e) => {
                const model = carModels.find(m => m.id === e.target.value);
                if (model) setSelectedCarModel(model);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {carModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
              {categoryTitles[category]}
            </h2>

            <div className="space-y-4">
              {categoryServices.map(service => (
                <label
                  key={service.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedServices.has(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-slate-800">{service.name}</span>
                      {service.description && (
                        <p className="text-sm text-slate-600">{service.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-slate-800">₹{service.price}</span>
                </label>
              ))}
            </div>

            {selectedServices.size > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Subtotal:</span>
                    <span className="font-semibold">₹{total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">GST ({gstPercentage}%):</span>
                    <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleViewBill}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>View Overall Bill</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}