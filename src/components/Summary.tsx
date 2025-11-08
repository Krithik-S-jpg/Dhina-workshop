import React from 'react';
import { SavedBill, BillItem as SavedBillItem, Service } from '../types';
import { serviceCategories } from '../data/categories';

interface SummaryProps {
  todaysBills: SavedBill[];
  services: Service[];
}

interface BillItem extends SavedBillItem {
  category?: Service['category'];
}

export function Summary({ todaysBills, services }: SummaryProps) {
  const totalRevenue = todaysBills.reduce((acc, bill) => acc + bill.netAmount, 0);

  const categoryTotals = serviceCategories.map(category => {
    const total = todaysBills.reduce((acc, bill) => {
      return acc + bill.items.reduce((itemAcc, item) => {
        const service = services.find(s => s.name === item.description);
        if (service && service.category === category.category) {
          return itemAcc + item.amount;
        }
        return itemAcc;
      }, 0);
    }, 0);
    return { ...category, total };
  });

  const soldItems = todaysBills.flatMap(bill => bill.items).reduce((acc, item) => {
    const existingItem = acc.find(i => i.description === item.description);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as BillItem[]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Today's Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-800">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-800">Total Bills</h3>
          <p className="text-3xl font-bold text-green-600">{todaysBills.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-yellow-800">Items Sold</h3>
          <p className="text-3xl font-bold text-yellow-600">{soldItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Revenue by Category</h3>
          <div className="space-y-3">
            {categoryTotals.map(cat => (
              <div key={cat.category} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-slate-600">{cat.title}</span>
                <span className="font-bold text-slate-800">₹{cat.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Sold Items Summary</h3>
          <div className="overflow-x-auto border rounded-lg max-h-96">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity Sold</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {soldItems.map(item => (
                  <tr key={item.description}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600 text-right">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
