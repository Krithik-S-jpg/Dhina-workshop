import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Percent, Car } from 'lucide-react';
import { Service, CarModel } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultGstPercentage } from '../data/mockData';

interface AdminPanelProps {
  services: Service[];
  carModels: CarModel[];
  onBack: () => void;
  onUpdateServices: (services: Service[]) => void;
  onUpdateCarModels: (carModels: CarModel[]) => void;
}

export function AdminPanel({ services, carModels, onBack, onUpdateServices, onUpdateCarModels }: AdminPanelProps) {
  const [gstPercentage, setGstPercentage] = useLocalStorage<number>('car-wash-gst', defaultGstPercentage);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCarModel, setEditingCarModel] = useState<CarModel | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingNewCar, setIsAddingNewCar] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'cars'>('services');
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    price: 0,
    category: 'water-service',
    description: '',
  });
  const [newCarModel, setNewCarModel] = useState<Partial<CarModel>>({
    name: '',
    brand: '',
  });

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (editingService) {
      const updatedServices = services.map(s => 
        s.id === editingService.id ? editingService : s
      );
      onUpdateServices(updatedServices);
      setEditingService(null);
    }
  };

  const handleDelete = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updatedServices = services.filter(s => s.id !== serviceId);
      onUpdateServices(updatedServices);
    }
  };

  const handleAddNew = () => {
    if (newService.name && newService.price) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        price: newService.price,
        category: newService.category as Service['category'],
        description: newService.description,
      };
      onUpdateServices([...services, service]);
      setNewService({ name: '', price: 0, category: 'water-service', description: '' });
      setIsAddingNew(false);
    }
  };

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
            <div className="flex space-x-2">
              {activeTab === 'services' && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              )}
              {activeTab === 'cars' && (
                <button
                  onClick={() => setIsAddingNewCar(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Car Model</span>
                </button>
              )}
            </div>
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
          </div>
        </div>

        {/* GST Configuration Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Percent className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">GST Configuration</h3>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-slate-700">GST Percentage:</label>
              <input
                type="number"
                value={gstPercentage}
                onChange={(e) => setGstPercentage(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                min="0"
                max="50"
                step="0.1"
              />
              <span className="text-sm text-slate-600">%</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-2">
            This GST rate will be applied to all bills. Current rate: {gstPercentage}%
          </p>
        </div>

        {activeTab === 'services' && isAddingNew && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value as Service['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleAddNew}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Add Service</span>
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cars' && isAddingNewCar && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Car Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Car Model Name
                </label>
                <input
                  type="text"
                  value={newCarModel.name}
                  onChange={(e) => setNewCarModel({ ...newCarModel, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter car model name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={newCarModel.brand}
                  onChange={(e) => setNewCarModel({ ...newCarModel, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter brand name"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleAddNewCar}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Add Car Model</span>
              </button>
              <button
                onClick={() => setIsAddingNewCar(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
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
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map(service => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingService?.id === service.id ? (
                          <input
                            type="text"
                            value={editingService.name}
                            onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="text-sm font-medium text-slate-900">{service.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingService?.id === service.id ? (
                          <select
                            value={editingService.category}
                            onChange={(e) => setEditingService({ ...editingService, category: e.target.value as Service['category'] })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {categoryOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {categoryOptions.find(opt => opt.value === service.category)?.label}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingService?.id === service.id ? (
                          <input
                            type="number"
                            value={editingService.price}
                            onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="text-sm text-slate-900 font-semibold">₹{service.price}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingService?.id === service.id ? (
                          <input
                            type="text"
                            value={editingService.description || ''}
                            onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="text-sm text-slate-600">{service.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingService?.id === service.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingService(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
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
          </div>
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