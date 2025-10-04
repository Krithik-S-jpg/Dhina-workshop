import React from 'react';
import { ArrowLeft, FileText, Car, Calendar } from 'lucide-react';
import { Service, CarModel } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultGstPercentage } from '../data/mockData';

interface BillViewProps {
  services: Service[];
  carModel: CarModel;
  onBack: () => void;
}

export function BillView({ services, carModel, onBack }: BillViewProps) {
  const [gstPercentage] = useLocalStorage<number>('car-wash-gst', defaultGstPercentage);
  const total = services.reduce((sum, service) => sum + service.price, 0);
  const gstAmount = (total * gstPercentage) / 100;
  const finalTotal = total + gstAmount;
  const currentDate = new Date().toLocaleDateString('en-IN');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-700 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 mb-4 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-center">Service Bill</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Nagu Enterprises</h2>
                  <p className="text-blue-100">Car Wash & Services</p>
                </div>
                <FileText className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Car className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-600">Vehicle</p>
                    <p className="font-semibold">{carModel.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-600">Date</p>
                    <p className="font-semibold">{currentDate}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <div className="space-y-3">
                  {services.map(service => (
                    <div key={service.id} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        {service.description && (
                          <p className="text-sm text-slate-600">{service.description}</p>
                        )}
                      </div>
                      <span className="font-semibold">₹{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Subtotal:</span>
                    <span className="text-lg font-semibold">₹{total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">GST ({gstPercentage}%):</span>
                    <span className="text-lg font-semibold">₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-gray-200">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  Print Bill
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}