import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { Service } from '../types';
import { ServiceCard } from './ServiceCard';
import { serviceCategories } from '../data/categories';
import { supabase } from '../supabaseClient';

interface ServiceManagementProps {
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
}

export function ServiceManagement({ services, onUpdateServices }: ServiceManagementProps) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    price: 0,
    category: 'water-service',
    description: '',
    image: '',
    hsn_code: '',
    gst_percentage: 0,
  });
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [defaultGst, setDefaultGst] = useState(0);

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (editingService) {
      const { data, error } = await supabase.from('services').update(editingService).match({ id: editingService.id }).select();
      if (error) {
        console.error('Error updating service:', error);
      } else {
        const updatedServices = services.map(s =>
          s.id === editingService.id ? data[0] as Service : s
        );
        onUpdateServices(updatedServices);
        setEditingService(null);
      }
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const { error } = await supabase.from('services').delete().match({ id: serviceId });
      if (error) {
        console.error('Error deleting service:', error);
      } else {
        const updatedServices = services.filter(s => s.id !== serviceId);
        onUpdateServices(updatedServices);
      }
    }
  };

  const handleAddNew = async () => {
    if (newService.name && newService.price) {
      const serviceToAdd = { ...newService, gst_percentage: newService.gst_percentage || defaultGst };
      const { data, error } = await supabase.from('services').insert([serviceToAdd]).select();
      if (error) {
        console.error('Error adding new service:', error);
      } else {
        onUpdateServices([...services, data[0] as Service]);
        setNewService({ name: '', price: 0, category: 'water-service', description: '', image: '', hsn_code: '' });
        setIsAddingNew(false);
      }
    }
  };

  const categoryOptions = [
    { value: 'water-service', label: 'Water Service' },
    { value: 'wheel-alignment', label: 'Wheel Alignment' },
    { value: 'car-accessories', label: 'Car Accessories' },
    { value: 'cng-lpg', label: 'CNG/LPG Service' },
    { value: 'ac-service', label: 'A/C Service' },
  ];

  const filteredServices = services.filter(service =>
    service.category === selectedCategory &&
    service.name.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  if (!selectedCategory) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Select a Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {serviceCategories.map(category => (
            <ServiceCard
              key={category.category}
              title={category.title}
              image={category.image}
              category={category.category}
              onClick={() => setSelectedCategory(category.category)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Categories</span>
        </button>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <input
          type="number"
          placeholder="Default GST %"
          value={defaultGst}
          onChange={(e) => setDefaultGst(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => {
            const updatedServices = services.map(service => {
              if (service.category === selectedCategory) {
                return { ...service, gst_percentage: defaultGst };
              }
              return service;
            });
            onUpdateServices(updatedServices);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Apply to All
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search services by name..."
          value={adminSearchQuery}
          onChange={(e) => setAdminSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isAddingNew && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="number" placeholder="Price" value={newService.price} onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <select value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value as Service['category'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              {categoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <input type="text" placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Image URL" value={newService.image} onChange={(e) => setNewService({ ...newService, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="HSN Code" value={newService.hsn_code} onChange={(e) => setNewService({ ...newService, hsn_code: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="number" placeholder="GST %" value={newService.gst_percentage} onChange={(e) => setNewService({ ...newService, gst_percentage: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Add</button>
            <button onClick={() => setIsAddingNew(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">HSN Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">GST %</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map(service => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{service.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">₹{service.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{service.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{service.hsn_code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{service.gst_percentage}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Service Name" value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Price" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <select value={editingService.category} onChange={(e) => setEditingService({ ...editingService, category: e.target.value as Service['category'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {categoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <input type="text" placeholder="Description" value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Image URL" value={editingService.image} onChange={(e) => setEditingService({ ...editingService, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="HSN Code" value={editingService.hsn_code} onChange={(e) => setEditingService({ ...editingService, hsn_code: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="GST %" value={editingService.gst_percentage} onChange={(e) => setEditingService({ ...editingService, gst_percentage: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex space-x-2 mt-4">
              <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Save</button>
              <button onClick={() => setEditingService(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}