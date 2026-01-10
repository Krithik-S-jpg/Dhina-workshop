import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Service, CarModel, BillItem, Category } from '../types';

interface ServiceSelectionProps {
  category: Category;
  services: Service[];
  carModels: CarModel[];
  onBack: () => void;
  onViewBill: (carModel: CarModel) => void;
  billItems: BillItem[];
  onBillItemChange: (service: Service, quantity: number) => void;
  isGstEnabled: boolean;
  isDiscountEnabled: boolean;
}

const categoryTitles: Record<Category, string> = {
  'good-year': 'Good Year',
  'bridgestone': 'Bridgestone',
  'yokohama': 'Yokohama',
  'continental': 'Continental',
  'mrf': 'MRF',
  'michelin': 'Michelin',
  'apollo': 'Apollo',
  'jk-tyre': 'JK Tyre',
  'ceat': 'CEAT',
  'firestone': 'Firestone',
  'pirelli': 'Pirelli',
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
  const [selectedCarModel, setSelectedCarModel] = useState<CarModel | undefined>(carModels[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<'tube' | 'tubeless' | 'all'>('all');

  const categoryServices = services.filter(service => {
    const matchesCategory = service.category === category;
    if (!matchesCategory) return false;

    if (selectedSubCategory === 'all') return true;

    // Check if service has explicit type or try to detect from name
    if (service.type) {
      return service.type === selectedSubCategory;
    }

    // Fallback: check name/description for keywords
    const nameLower = service.name.toLowerCase();
    const descLower = (service.description || '').toLowerCase();

    if (selectedSubCategory === 'tube') {
      return (nameLower.includes('tube') && !nameLower.includes('tubeless')) ||
             (descLower.includes('tube') && !descLower.includes('tubeless'));
    }

    if (selectedSubCategory === 'tubeless') {
      return nameLower.includes('tubeless') || descLower.includes('tubeless');
    }

    return true;
  });

  const handleViewBill = () => {
    if (selectedCarModel) {
      onViewBill(selectedCarModel);
    }
  };

  const subtotal = billItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const totalDiscount = billItems.reduce((sum, item) => {
    const discount = (item.discountPercentage ?? 0) / 100;
    return sum + (item.service.price * item.quantity * discount);
  }, 0);
  const totalAfterDiscount = subtotal - totalDiscount;
  const gstAmount = isGstEnabled
    ? billItems.reduce((sum, item) => {
        const itemTotal = item.service.price * item.quantity;
        const discountAmount = isDiscountEnabled ? itemTotal * ((item.discountPercentage ?? 0) / 100) : 0;
        const priceAfterDiscount = itemTotal - discountAmount;
        const itemGst = priceAfterDiscount * ((item.service.gst_percentage ?? 0) / 100);
        return sum + itemGst;
      }, 0)
    : 0;
  const finalTotal = totalAfterDiscount + gstAmount;

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

              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`px-4 py-2 rounded-full ${
                    selectedSubCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedSubCategory('tube')}
                  className={`px-4 py-2 rounded-full ${
                    selectedSubCategory === 'tube'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Tube
                </button>
                <button
                  onClick={() => setSelectedSubCategory('tubeless')}
                  className={`px-4 py-2 rounded-full ${
                    selectedSubCategory === 'tubeless'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Tubeless
                </button>
              </div>

              <div className="space-y-4">
                {categoryServices.length === 0 ? (
                    <p className="text-center text-gray-500">No tyres found for this selection.</p>
                ) : null}
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
                {carModels.length > 0 ? (
                  <select
                    value={selectedCarModel?.id || ''}
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
                ) : (
                  <p className="text-sm text-red-500">No car models available.</p>
                )}
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
                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                      </div>
                      {isDiscountEnabled && totalDiscount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="text-sm">Discount:</span>
                          <span className="font-semibold">- ₹{totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {isGstEnabled && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">GST:</span>
                          <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleViewBill}
                      disabled={!selectedCarModel}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
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