import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Service, CarModel, BillItem } from '../types';

interface ServiceSelectionProps {
  category: 'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service';
  services: Service[];
  carModels: CarModel[];
  onBack: () => void;
  onViewBill: (carModel: CarModel) => void;
  billItems: BillItem[];
  onBillItemChange: (service: Service, quantity: number) => void;
  isGstEnabled: boolean;
  isDiscountEnabled: boolean;
}

const categoryTitles = {
  'wheel-alignment': 'Wheel Alignment',
  'water-service': 'Water Services',
  'car-accessories': 'Car Accessories',
  'cng-lpg': 'CNG/LPG Services',
  'ac-service': 'A/C Services',
};

export function ServiceSelection({
  category,
  services,
  carModels,
  onBack,
  onViewBill,
  billItems,
  onBillItemChange,
  isGstEnabled,
  gstPercentage,
  isDiscountEnabled,
}: ServiceSelectionProps) {
  const [selectedCarModel, setSelectedCarModel] = useState<CarModel>(carModels[0]);

  const categoryServices = services.filter(service => service.category === category);

  const handleViewBill = () => {
    onViewBill(selectedCarModel);
  };

  const calculateItemValues = (item: BillItem) => {
    const grossRate = item.service.price; // Inclusive Rate
    const qty = item.quantity;
    const discountPct = isDiscountEnabled ? (item.discountPercentage ?? 0) : 0;
    const gstPct = isGstEnabled ? (item.service.gst_percentage ?? 0) : 0;

    // 1. Calculate Total Inclusive Amount for line item (after discount)
    const discountAmount = grossRate * qty * (discountPct / 100);
    const totalInclusive = (grossRate * qty) - discountAmount;

    // 2. Extract Base Amount and GST Amount
    // Formula: Inclusive = Base * (1 + GST%)  =>  Base = Inclusive / (1 + GST%)
    const baseAmount = totalInclusive / (1 + gstPct / 100);
    const gstAmount = totalInclusive - baseAmount;

    return {
      baseAmount,
      gstAmount,
      totalInclusive,
      discountAmount
    };
  };

  const totals = billItems.reduce((acc, item) => {
    const values = calculateItemValues(item);
    return {
      subtotal: acc.subtotal + values.baseAmount,
      gstAmount: acc.gstAmount + values.gstAmount,
      netAmount: acc.netAmount + values.totalInclusive,
      totalDiscount: acc.totalDiscount + values.discountAmount
    };
  }, { subtotal: 0, gstAmount: 0, netAmount: 0, totalDiscount: 0 });

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
                {categoryServices.map(service => {
                  const billItem = billItems.find(item => item.service.id === service.id);
                  const quantity = billItem ? billItem.quantity : 0;
                  const isSelected = quantity > 0;
                  const canIncrease = service.stock === undefined || quantity < service.stock;

                  return (
                    <div
                      key={service.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex-grow mr-4">
                        <span className="font-medium text-slate-800">{service.name}</span>
                        {service.description && (
                          <p className="text-sm text-slate-600">{service.description}</p>
                        )}
                        {isDiscountEnabled && service.discountPercentage && (
                          <p className="text-xs text-green-600 font-semibold mt-1">{service.discountPercentage}% off</p>
                        )}
                        {service.stock !== undefined && (
                          <p className={`text-xs mt-1 ${service.stock - quantity > 0 ? 'text-slate-500' : 'text-red-500'}`}>
                            {service.stock - quantity > 0 ? `${service.stock - quantity} left in stock` : 'Out of stock'}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-slate-800">₹{service.price}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onBillItemChange(service, quantity - 1)}
                            disabled={!isSelected}
                            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-bold"
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold w-8 text-center" data-testid={`quantity-${service.id}`}>{quantity}</span>
                          <button
                            onClick={() => onBillItemChange(service, quantity + 1)}
                            disabled={!canIncrease}
                            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                        <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
                      </div>
                      {isDiscountEnabled && totals.totalDiscount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="text-sm">Discount:</span>
                          <span className="font-semibold">- ₹{totals.totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {isGstEnabled && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">GST:</span>
                          <span className="font-semibold">₹{totals.gstAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">₹{totals.netAmount.toFixed(2)}</span>
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