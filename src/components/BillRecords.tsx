import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Trash2, Eye } from 'lucide-react';
import { SavedBill } from '../types';

interface BillRecordsProps {
  bills: SavedBill[];
  onBack: () => void;
}

export function BillRecords({ bills, onBack }: BillRecordsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const filteredBills = bills.filter(bill => {
    const term = searchTerm.toLowerCase();
    const matchesTerm =
      bill.billNumber.toLowerCase().includes(term) ||
      bill.customerName.toLowerCase().includes(term) ||
      bill.vehicle.toLowerCase().includes(term);

    const matchesDate = searchDate ? bill.date === searchDate : true;

    return matchesTerm && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-slate-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Admin Panel</span>
          </button>
          <h1 className="text-2xl font-bold">Bill Records</h1>
          <div />
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by bill number, customer name, or vehicle..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Number</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Total Amount</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBills.length > 0 ? (
                  filteredBills.map(bill => (
                    <tr key={bill.billNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.billNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bill.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bill.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bill.vehicle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bill.items.map(i => i.description).join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">₹{bill.netAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors"><Eye className="w-5 h-5" /></button>
                        <button className="text-red-600 hover:text-red-800 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="mt-4 text-lg font-medium">No bills found</p>
                        <p className="text-sm">Try adjusting your search or date filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}