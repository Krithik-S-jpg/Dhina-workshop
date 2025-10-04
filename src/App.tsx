import React, { useState } from 'react';
import { Header } from './components/Header';
import { ServiceCard } from './components/ServiceCard';
import { ServiceSelection } from './components/ServiceSelection';
import { BillView } from './components/BillView';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { BillRecords } from './components/BillRecords';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Service, CarModel, BillItem, SavedBill } from './types';
import { carModels, initialServices, defaultGstPercentage } from './data/mockData';

type View = 'home' | 'service-selection' | 'bill' | 'admin-login' | 'admin-panel' | 'bill-records';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service'>('water-service');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedCarModel, setSelectedCarModel] = useState<CarModel>(carModels[0]);
  const [services, setServices] = useLocalStorage<Service[]>('car-wash-services', initialServices);
  const [carModelsList, setCarModelsList] = useLocalStorage<CarModel[]>('car-models', carModels);
  const [gstPercentage] = useLocalStorage<number>('car-wash-gst', defaultGstPercentage);
  const [savedBills, setSavedBills] = useLocalStorage<SavedBill[]>('car-wash-saved-bills', []);

  const handleServiceCardClick = (category: 'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service') => {
    setSelectedCategory(category);
    setCurrentView('service-selection');
  };

  const handleBillItemChange = (service: Service, quantity: number) => {
    setBillItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === service.id);

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return prevItems.filter(item => item.service.id !== service.id);
      }

      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(item =>
          item.service.id === service.id ? { ...item, quantity } : item
        );
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, { service, quantity, selected: true }];
      }
    });
  };

  const handleViewBill = (carModel: CarModel) => {
    setSelectedCarModel(carModel);
    setCurrentView('bill');
  };

  const handleSaveBill = (bill: SavedBill) => {
    // Deduct stock from inventory
    const updatedServices = services.map(service => {
      const billedItem = billItems.find(item => item.service.id === service.id);
      if (billedItem && service.stock !== undefined) {
        return {
          ...service,
          stock: service.stock - billedItem.quantity,
        };
      }
      return service;
    });
    setServices(updatedServices);

    setSavedBills(prevBills => [...prevBills, bill]);
    setBillItems([]); // Clear current bill
    setCurrentView('home'); // or 'bill-records'
  };

  const handleViewBillRecords = () => {
    setCurrentView('bill-records');
  };

  const handleAdminLogin = () => {
    setCurrentView('admin-login');
  };

  const handleAdminLoginSuccess = () => {
    setCurrentView('admin-panel');
  };

  const handleBackToHome = () => {
    setBillItems([]);
    setCurrentView('home');
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
  };

  const handleBackToServices = () => {
    setCurrentView('service-selection');
  };

  const handleBackToAdminPanel = () => {
    setCurrentView('admin-panel');
  };

  const handleUpdateServices = (updatedServices: Service[]) => {
    setServices(updatedServices);
  };

  const handleUpdateCarModels = (updatedCarModels: CarModel[]) => {
    setCarModelsList(updatedCarModels);
  };

  if (currentView === 'admin-login') {
    return <AdminLogin onBack={handleBackToHome} onLogin={handleAdminLoginSuccess} />;
  }

  if (currentView === 'admin-panel') {
    return (
      <AdminPanel
        services={services}
        carModels={carModelsList}
        onBack={handleBackToHome}
        onUpdateServices={handleUpdateServices}
        onUpdateCarModels={handleUpdateCarModels}
        onViewBillRecords={handleViewBillRecords}
      />
    );
  }

  if (currentView === 'bill-records') {
    return <BillRecords bills={savedBills} onBack={handleBackToAdminPanel} />;
  }

  if (currentView === 'service-selection') {
    return (
      <ServiceSelection
        category={selectedCategory}
        services={services}
        carModels={carModelsList}
        onBack={handleNavigateHome}
        onViewBill={handleViewBill}
        billItems={billItems}
        onBillItemChange={handleBillItemChange}
      />
    );
  }

  if (currentView === 'bill') {
    return (
      <BillView
        billItems={billItems}
        carModel={selectedCarModel}
        onBack={handleBackToServices}
        onSaveBill={handleSaveBill}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdminClick={handleAdminLogin} />
      
      <div className="bg-slate-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Car Wash Company</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-blue-600 px-3 py-1 rounded-full">Wheel Alignment</span>
            <span className="bg-blue-600 px-3 py-1 rounded-full">Car Wash</span>
            <span className="bg-blue-600 px-3 py-1 rounded-full">CNG/LPG Service</span>
            <span className="bg-blue-600 px-3 py-1 rounded-full">A/C Service</span>
            <span className="bg-blue-600 px-3 py-1 rounded-full">Generate Bill</span>
            <span className="bg-blue-600 px-3 py-1 rounded-full">View Overall Bill</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          <ServiceCard
            title="Wheel Alignment"
            image="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=500"
            category="wheel-alignment"
            onClick={() => handleServiceCardClick('wheel-alignment')}
          />
          <ServiceCard
            title="Water Service"
            image="https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=500"
            category="water-service"
            onClick={() => handleServiceCardClick('water-service')}
          />
          <ServiceCard
            title="Car Accessories"
            image="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500"
            category="car-accessories"
            onClick={() => handleServiceCardClick('car-accessories')}
          />
          <ServiceCard
            title="CNG/LPG Service"
            image="https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=500"
            category="cng-lpg"
            onClick={() => handleServiceCardClick('cng-lpg')}
          />
          <ServiceCard
            title="A/C Service"
            image="https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=500"
            category="ac-service"
            onClick={() => handleServiceCardClick('ac-service')}
          />
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentView('bill')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-lg"
          >
            View Overall Bill
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;