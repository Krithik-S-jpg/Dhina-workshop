import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Service, CarModel, BillItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultGstPercentage } from '../data/mockData';

interface ServiceSelectionProps {
  category: 'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service';
  services: Service[];
  carModels: CarModel[];
  onBack: () => void;
  onViewBill: (carModel: CarModel) => void;
  billItems: BillItem[];
  onServiceToggle: (service: Service) => void;
}

const categoryTitles = {
  'wheel-alignment': 'Wheel Alignment',
  'water-service': 'Water Services',
  'car-accessories': 'Car Accessories',
  'cng-lpg': 'CNG/LPG Services',
  'ac-service': 'A/C Services',
};

export function ServiceSelection({ category, services, carModels, onBack, onViewBill, billItems, onServiceToggle }: ServiceSelectionProps) {
  const [selectedCarModel, setSelectedCarModel] = useState<CarModel>(carModels[0]);
  const [gstPercentage] = useLocalStorage<number>('car-wash-gst', defaultGstPercentage);

  const categoryServices = services.filter(service => service.category === category);
  const selectedServiceIds = new Set(billItems.map(item => item.service.id));

  const handleViewBill = () => {
    onViewBill(selectedCarModel);
  };

  const total = billItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
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
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold text-center">Select Services</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
                {categoryTitles[category]}
              </h2>

              <div className="space-y-4">
                {categoryServices.map(service => (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedServiceIds.has(service.id)
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.has(service.id)}
                        onChange={() => onServiceToggle(service)}
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
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Your Bill</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Car Model:
                </label>
                <select
                  value={selectedCarModel.id}
                  onChange={(e) => {
                    const model = carModels.find(m => m.id === e.target.value);
                    if (model) setSelectedCarModel(model);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  {carModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              {billItems.length > 0 ? (
                <>
                  <div className="space-y-3 mb-4">
                    {billItems.map(item => (
                      <div key={item.service.id} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700">{item.service.name}</span>
                        <span className="font-semibold">₹{item.service.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Subtotal:</span>
                        <span className="font-semibold">₹{total.toFixed(2)}</span>
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
                      <span>Proceed to Bill</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-sm text-slate-600">No services selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}