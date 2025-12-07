import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Percent, Car, FileText, ArrowRight } from 'lucide-react';
import { Service, CarModel, SavedBill } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultGstPercentage } from '../data/mockData';
import { ServiceManagement } from './ServiceManagement';
import { Summary } from './Summary';
import { Notifications } from './Notifications';
import { ServiceCard } from './ServiceCard';
import { serviceCategories } from '../data/categories';

interface AdminPanelProps {
  services: Service[];
  carModels: CarModel[];
  savedBills: SavedBill[];
  onBack: () => void;
  onUpdateServices: (services: Service[]) => void;
  onUpdateCarModels: (carModels: CarModel[]) => void;
  onViewBillRecords: () => void;
  onNavigateToSettings: () => void;
  stockNotificationLimit: number;
}

export function AdminPanel({ services, carModels, savedBills, onBack, onUpdateServices, onUpdateCarModels, onViewBillRecords, onNavigateToSettings, stockNotificationLimit }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'cars' | 'inventory' | 'summary' | 'notifications'>('services');
  const [editableServices, setEditableServices] = useState<Service[]>(services);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingCarModel, setEditingCarModel] = useState<CarModel | null>(null);
  const [isAddingNewCar, setIsAddingNewCar] = useState(false);
  const [inventorySelectedCategory, setInventorySelectedCategory] = useState<string | null>(null);
  const [newCarModel, setNewCarModel] = useState<Partial<CarModel>>({
    name: '',
    brand: '',
  });

  const lowStockServices = services.filter(service => service.stock !== undefined && service.stock < stockNotificationLimit);

  useEffect(() => {
    setEditableServices(services);
  }, [services]);

  const handleEditCar = (carModel: CarModel) => {
    setEditingCarModel({ ...carModel });
    setIsAddingNewCar(false);
  };

  const handleSaveCar = () => {
    if (editingCarModel) {
      const updatedCarModels = carModels.map(c =>
        c.id === editingCarModel.id ? editingCarModel : c
      );
      onUpdateCarModels(updatedCarModels);
      setEditingCarModel(null);
    }
  };

  const handleDeleteCar = (carModelId: string) => {
    if (confirm('Are you sure you want to delete this car model?')) {
      const updatedCarModels = carModels.filter(c => c.id !== carModelId);
      onUpdateCarModels(updatedCarModels);
    }
  };

  const handleAddNewCar = () => {
    if (newCarModel.name && newCarModel.brand) {
      const carModel: CarModel = {
        id: Date.now().toString(),
        name: newCarModel.name,
        brand: newCarModel.brand,
      };
      onUpdateCarModels([...carModels, carModel]);
      setNewCarModel({ name: '', brand: '' });
      setIsAddingNewCar(false);
    }
  };

    const categoryOptions = [
    { value: 'water-service', label: 'Water Service' },
    { value: 'wheel-alignment', label: 'Wheel Alignment' },
    { value: 'car-accessories', label: 'Car Accessories' },
    { value: 'cng-lpg', label: 'CNG/LPG Service' },
    { value: 'ac-service', label: 'A/C Service' },
  ];

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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Panel - Management</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Service Management
            </button>
            <button
              onClick={() => setActiveTab('cars')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'cars'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Car Models Management
            </button>
             <button
              onClick={onViewBillRecords}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors text-gray-600 hover:text-blue-600`}
            >
              Bill Management
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Inventory Management
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'summary'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`relative flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Notifications
              {lowStockServices.length > 0 && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {lowStockServices.length}
                </span>
              )}
            </button>
            <button
              onClick={onNavigateToSettings}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors text-gray-600 hover:text-blue-600`}
              data-testid="settings-button"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Bill Management Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Bill Management</h3>
            </div>
            <button
              onClick={onViewBillRecords}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>View All Bill Records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-2">
            View, search, and manage all saved bill records.
          </p>
        </div>

        {activeTab === 'services' && (
          <ServiceManagement services={services} onUpdateServices={onUpdateServices} />
        )}

        {activeTab === 'summary' && (
          <Summary bills={savedBills} services={services} />
        )}

        {activeTab === 'notifications' && (
          <Notifications lowStockServices={lowStockServices} />
        )}

        {activeTab === 'inventory' && (
          <>
            {!inventorySelectedCategory ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">Select a Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {serviceCategories.map(category => (
                    <ServiceCard
                      key={category.category}
                      title={category.title}
                      image={category.image}
                      category={category.category}
                      onClick={() => setInventorySelectedCategory(category.category)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setInventorySelectedCategory(null)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back to Categories</span>
                    </button>
                    <h3 className="text-lg font-semibold">Inventory Levels - {categoryOptions.find(opt => opt.value === inventorySelectedCategory)?.label}</h3>
                  </div>
                  <button
                    onClick={() => {
                      onUpdateServices(editableServices);
                      setSuccessMessage('Stock updated successfully!');
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    {successMessage}
                  </div>
                )}
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Service Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Stock Level
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {editableServices
                        .filter(service => service.category === inventorySelectedCategory)
                        .map(service => (
                          <tr key={service.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">{service.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {categoryOptions.find(opt => opt.value === service.category)?.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={service.stock ?? ''}
                                onChange={(e) => {
                                  const updatedServices = editableServices.map(s =>
                                    s.id === service.id
                                      ? { ...s, stock: e.target.value === '' ? undefined : Number(e.target.value) }
                                      : s
                                  );
                                  setEditableServices(updatedServices);
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="N/A"
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'cars' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Car Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carModels.map(carModel => (
                  <tr key={carModel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCarModel?.id === carModel.id ? (
                        <input
                          type="text"
                          value={editingCarModel.name}
                          onChange={(e) => setEditingCarModel({ ...editingCarModel, name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="text-sm font-medium text-slate-900">{carModel.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCarModel?.id === carModel.id ? (
                        <input
                          value={editingCarModel.brand}
                          onChange={(e) => setEditingCarModel({ ...editingCarModel, brand: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="text-sm text-slate-900">{carModel.brand}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingCarModel?.id === carModel.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveCar}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCarModel(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCar(carModel)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(carModel.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}