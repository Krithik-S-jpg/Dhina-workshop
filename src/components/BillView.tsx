import React, { useState } from 'react';
import { ArrowLeft, Edit, Download, Save } from 'lucide-react';
import { BillItem, CarModel, SavedBill } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultGstPercentage } from '../data/mockData';
// import logo from '../assets/logo.png'; // Assuming logo is placed here

interface BillViewProps {
  billItems: BillItem[];
  carModel: CarModel;
  onBack: () => void;
  onSaveBill: (bill: SavedBill) => void;
}

export function BillView({ billItems, carModel, onBack, onSaveBill }: BillViewProps) {
  const [gstPercentage] = useLocalStorage<number>('car-wash-gst', defaultGstPercentage);
  const [customerName, setCustomerName] = useState('CUSTOMER NAME');
  const [customerAddress, setCustomerAddress] = useState('CUSTOMER ADDRESS');
  const [customerPhone, setCustomerPhone] = useState('9000000000');
  const [gstNumber, setGstNumber] = useState('GST123456789');
  const [isEditing, setIsEditing] = useState(true);

  const total = billItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const gstAmount = (total * gstPercentage) / 100;
  const netAmount = total + gstAmount;
  const billNumber = `B${Math.random().toString().substr(2, 6).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleSave = () => {
    const billToSave: SavedBill = {
      billNumber,
      customerName,
      customerAddress,
      customerPhone,
      vehicle: carModel.name,
      date: currentDate,
      gstNumber,
      items: billItems.map(item => ({
        description: item.service.name,
        hsnCode: item.service.hsnCode,
        quantity: item.quantity,
        rate: item.service.price,
        taxPercentage: gstPercentage,
        amount: item.service.price * item.quantity,
      })),
      total,
      gstAmount,
      netAmount,
    };
    onSaveBill(billToSave);
    alert('Bill saved successfully!');
  };

  const numberToWords = (num: number): string => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != '0') ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim() + ' Only';
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-slate-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold">Service Bill</h1>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>{isEditing ? 'Lock' : 'Edit'}</span>
            </button>
            <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div id="bill-content" className="bg-white p-8 border border-gray-300 shadow-lg rounded-lg max-w-4xl mx-auto">
          <header className="flex justify-between items-start pb-4 border-b-2 border-gray-800">
            <div className="flex items-center">
              {/* <img src={logo} alt="Bull Logo" className="h-20 mr-4" /> */}
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800">Nagu Enterprises</h2>
                <p className="text-sm"># 2/A-2, Tanjore Main Road, OPP. SIT Hostel,</p>
                <p className="text-sm">Ariyamangalam, Trichy - 620010.</p>
                <p className="text-sm">HP: 95850 71712, 96264 00785</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-600">(ORIGINAL)</h3>
            </div>
          </header>

          <section className="mt-6">
            <div className="flex justify-between">
              <div className="w-1/2 pr-4">
                <h4 className="font-bold mb-2 text-gray-700">To:</h4>
                {isEditing ? (
                  <>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-1 border border-dashed border-gray-400 rounded mb-1" />
                    <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full p-1 border border-dashed border-gray-400 rounded mb-1" rows={2}></textarea>
                    <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full p-1 border border-dashed border-gray-400 rounded" />
                  </>
                ) : (
                  <>
                    <p className="font-semibold">{customerName}</p>
                    <p>{customerAddress}</p>
                    <p>Ph: {customerPhone}</p>
                  </>
                )}
              </div>
              <div className="w-1/2 pl-4 text-right">
                <p><span className="font-bold">Bill No:</span> {billNumber}</p>
                <p><span className="font-bold">Date:</span> {currentDate}</p>
                <p><span className="font-bold">Vehicle:</span> {carModel.name}</p>
                <p><span className="font-bold">GST No:</span>
                  {isEditing ? <input type="text" value={gstNumber} onChange={e => setGstNumber(e.target.value)} className="p-1 border border-dashed border-gray-400 rounded" /> : gstNumber}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 p-2">S.No</th>
                  <th className="border border-gray-400 p-2 text-left">Description</th>
                  <th className="border border-gray-400 p-2">HSN Code</th>
                  <th className="border border-gray-400 p-2">Qty</th>
                  <th className="border border-gray-400 p-2">Rate</th>
                  <th className="border border-gray-400 p-2">Tax%</th>
                  <th className="border border-gray-400 p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, index) => (
                  <tr key={item.service.id}>
                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-400 p-2">{item.service.name}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.service.hsnCode}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.quantity} Nos</td>
                    <td className="border border-gray-400 p-2 text-right">{item.service.price.toFixed(2)}</td>
                    <td className="border border-gray-400 p-2 text-center">{gstPercentage}%</td>
                    <td className="border border-gray-400 p-2 text-right">{(item.service.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                {/* Add empty rows for spacing */}
                {Array.from({ length: Math.max(0, 10 - billItems.length) }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-gray-400 p-2 h-8"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <footer className="mt-6">
            <div className="flex justify-between items-start">
              <div className="w-2/3">
                <p className="text-xs">E. & O.E.</p>
                <p><span className="font-bold">Total Qty:</span> {billItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="font-bold">Rupees {numberToWords(Math.round(netAmount))}</p>
              </div>
              <div className="w-1/3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">GST ({gstPercentage}%):</span>
                    <span>{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-lg border-t-2 border-b-2 border-gray-800 my-1 py-1">
                    <span>Net Amount:</span>
                    <span>{netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 text-right">
              <p className="font-bold">For Nagu Enterprises</p>
              <div className="mt-16 border-t border-dashed border-gray-500 pt-1 inline-block">
                Authorized Signatory
              </div>
            </div>
          </footer>
        </div>

        <div className="max-w-4xl mx-auto mt-6 flex justify-center">
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-12 rounded-lg font-bold text-lg flex items-center space-x-2">
              <Save className="w-6 h-6" />
              <span>Save to Records</span>
            </button>
        </div>
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #bill-content, #bill-content * {
            visibility: visible;
          }
          #bill-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}