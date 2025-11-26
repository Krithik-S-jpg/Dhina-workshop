import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ServiceCard } from './components/ServiceCard';
import { ServiceSelection } from './components/ServiceSelection';
import { BillView } from './components/BillView';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { AdminSettings } from './components/AdminSettings';
import { BillRecords } from './components/BillRecords';
import { BillDetails } from './components/BillDetails';
import { Service, CarModel, BillItem, SavedBill } from './types';
import { serviceCategories } from './data/categories';
import { supabase } from './supabaseClient';

type View = 'home' | 'service-selection' | 'bill' | 'admin-login' | 'admin-panel' | 'bill-records' | 'admin-settings' | 'bill-details';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service'>('water-service');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCarModel, setSelectedCarModel] = useState<CarModel | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [carModelsList, setCarModelsList] = useState<CarModel[]>([]);
  const [savedBills, setSavedBills] = useState<SavedBill[]>([]);
  const [billToView, setBillToView] = useState<SavedBill | null>(null);
  const [isGstEnabled, setIsGstEnabled] = useState(true);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchCarModels();
    fetchSavedBills();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*');
    if (error) console.error('Error fetching services:', error);
    else setServices(data as Service[]);
  };

  const fetchCarModels = async () => {
    const { data, error } = await supabase.from('car_models').select('*');
    if (error) console.error('Error fetching car models:', error);
    else {
      setCarModelsList(data as CarModel[]);
      if (data && data.length > 0) {
        setSelectedCarModel(data[0] as CarModel);
      }
    }
  };

    const fetchSavedBills = async () => {
    const { data, error } = await supabase.from('saved_bills').select('*, bill_items(*)');
    if (error) {
      console.error('Error fetching saved bills:', error);
    } else {
      const bills = data.map(bill => ({
        id: bill.id,
        billNumber: bill.bill_number,
        customerName: bill.customer_name,
        customerAddress: bill.customer_address,
        customerPhone: bill.customer_phone,
        vehicleNumber: bill.vehicle_number,
        date: bill.date,
        gstNumber: bill.gst_number,
        total: bill.total,
        gstAmount: bill.gst_amount,
        sgst_amount: bill.sgst_amount,
        cgst_amount: bill.cgst_amount,
        netAmount: bill.net_amount,
        paymentMethod: bill.payment_method,
        items: bill.bill_items.map((item: any) => ({
          description: item.description,
          hsnCode: item.hsn_code,
          quantity: item.quantity,
          rate: item.rate,
          taxPercentage: item.tax_percentage,
          amount: item.amount,
          discountPercentage: item.discount_percentage,
        })),
      }));
      setSavedBills(bills as SavedBill[]);
    }
  };


  const handleServiceCardClick = (category: 'wheel-alignment' | 'water-service' | 'car-accessories' | 'cng-lpg' | 'ac-service') => {
    setSelectedCategory(category);
    setCurrentView('service-selection');
  };

  const handleBillItemChange = (service: Service, quantity: number) => {
    setBillItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === service.id);

      if (quantity <= 0) {
        return prevItems.filter(item => item.service.id !== service.id);
      }

      if (existingItem) {
        return prevItems.map(item =>
          item.service.id === service.id ? { ...item, quantity } : item
        );
      } else {
        return [...prevItems, { service, quantity, selected: true, discountPercentage: service.discount_percentage }];
      }
    });
  };

  const handleViewBill = (carModel: CarModel) => {
    setSelectedCarModel(carModel);
    setCurrentView('bill');
  };

  const handleDeleteBill = async (billNumber: string) => {
    const billToDelete = savedBills.find(b => b.billNumber === billNumber);
    if (!billToDelete) return;

    const { error } = await supabase.from('saved_bills').delete().match({ id: billToDelete.id });
    if (error) {
      console.error('Error deleting bill:', error);
    } else {
      setSavedBills(prevBills => prevBills.filter(b => b.billNumber !== billNumber));
    }
  };

  const handleViewSavedBill = (bill: SavedBill, print = false) => {
    setBillToView(bill);
    setCurrentView('bill-details');
    if (print) {
      setTimeout(() => window.print(), 500);
    }
  };

  const handleSaveBill = async (bill: SavedBill) => {
  const { data, error } = await supabase.from('saved_bills').insert([
    {
      bill_number: bill.billNumber,
      customer_name: bill.customerName,
      customer_address: bill.customerAddress,
      customer_phone: bill.customerPhone,
      vehicle_number: bill.vehicleNumber,
      date: bill.date,
      gst_number: bill.gstNumber,
      total: bill.total,
      gst_amount: bill.gstAmount,
      sgst_amount: bill.sgst_amount,
      cgst_amount: bill.cgst_amount,
      net_amount: bill.netAmount,
      payment_method: bill.paymentMethod,
    }
  ]).select().single();

  if (error) {
    console.error('Error saving bill:', error);
    return;
  }

    const billId = data.id;

  const billItemsToInsert = bill.items.map(item => ({
    bill_id: billId,
    description: item.description,
    hsn_code: item.hsnCode,
    quantity: item.quantity,
    rate: item.rate,
    tax_percentage: item.taxPercentage,
    amount: item.amount,
    discount_percentage: item.discountPercentage,
  }));

  const { error: itemsError } = await supabase.from('bill_items').insert(billItemsToInsert);

  if (itemsError) {
    console.error('Error saving bill items:', itemsError);
    // Optionally, delete the saved_bill entry if items fail to save
    await supabase.from('saved_bills').delete().match({ id: billId });
    return;
  }

      for (const item of bill.items) {
      const service = services.find(s => s.name === item.description);
      if (service && service.stock !== undefined) {
        const newStock = service.stock - item.quantity;
        await supabase.from('services').update({ stock: newStock }).match({ id: service.id });
      }
    }

    fetchServices();
    fetchSavedBills();
    setBillItems([]);
    setCurrentView('home');
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

  const handleNavigateToSettings = () => {
    setCurrentView('admin-settings');
  };

  const handleUpdateServices = async (updatedServices: Service[]) => {
  const { data, error } = await supabase.from('services').upsert(updatedServices).select();
  if (error) {
    console.error('Error updating services:', error);
  } else {
    setServices(data as Service[]);
  }
};

  const handleUpdateCarModels = async (updatedCarModels: CarModel[]) => {
  const { data, error } = await supabase.from('car_models').upsert(updatedCarModels).select();
  if (error) {
    console.error('Error updating car models:', error);
  } else {
    setCarModelsList(data as CarModel[]);
  }
};

  const filteredServiceCategories = serviceCategories.filter(cat => {
    if (!searchQuery) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    if (cat.title.toLowerCase().includes(query)) {
      return true;
    }
    return services.some(service =>
      service.category === cat.category &&
      service.name && service.name.toLowerCase().includes(query)
    );
  });

  if (currentView === 'admin-login') {
    return <AdminLogin onBack={handleBackToHome} onLogin={handleAdminLoginSuccess} />;
  }

  if (currentView === 'admin-panel') {
    return (
      <AdminPanel
        services={services}
        carModels={carModelsList}
        savedBills={savedBills}
        onBack={handleBackToHome}
        onUpdateServices={handleUpdateServices}
        onUpdateCarModels={handleUpdateCarModels}
        onViewBillRecords={handleViewBillRecords}
        onNavigateToSettings={handleNavigateToSettings}
      />
    );
  }

  if (currentView === 'admin-settings') {
    return (
      <AdminSettings
        onBack={handleBackToAdminPanel}
        isGstEnabled={isGstEnabled}
        setIsGstEnabled={setIsGstEnabled}
        isDiscountEnabled={isDiscountEnabled}
        setIsDiscountEnabled={setIsDiscountEnabled}
      />
    );
  }

  if (currentView === 'bill-records') {
    return <BillRecords bills={savedBills} onBack={handleBackToAdminPanel} onViewBill={handleViewSavedBill} onDeleteBill={handleDeleteBill} />;
  }

  if (currentView === 'bill-details' && billToView) {
    return <BillDetails bill={billToView} onBack={() => setCurrentView('bill-records')} isGstEnabled={isGstEnabled} />;
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
        isGstEnabled={isGstEnabled}
        isDiscountEnabled={isDiscountEnabled}
      />
    );
  }

  if (currentView === 'bill' && selectedCarModel) {
    return (
      <BillView
        billItems={billItems}
        carModel={selectedCarModel}
        onBack={handleBackToServices}
        onSaveBill={handleSaveBill}
        isGstEnabled={isGstEnabled}
        isDiscountEnabled={isDiscountEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdminClick={handleAdminLogin} />
      
      <div className="bg-slate-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Dhina Automobiles</h2>
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
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search for services or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            data-testid="service-search-input"
          />
        </div>

        {filteredServiceCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {filteredServiceCategories.map(cat => (
              <ServiceCard
                key={cat.category}
                title={cat.title}
                image={cat.image}
                category={cat.category}
                onClick={() => handleServiceCardClick(cat.category)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No services or categories found for "{searchQuery}".</p>
          </div>
        )}

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