import React, { useState } from 'react';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { BillItem, CarModel, SavedBill } from '../types';

interface BillViewProps {
  billItems: BillItem[];
  carModel: CarModel;
  onBack: () => void;
  onSaveBill: (bill: SavedBill) => void;
  isGstEnabled: boolean;
  isDiscountEnabled: boolean;
}

export function BillView({
  billItems,
  carModel,
  onBack,
  onSaveBill,
  isGstEnabled,
  isDiscountEnabled,
}: BillViewProps) {
  const [customerName, setCustomerName] = useState('CUSTOMER NAME');
  const [customerAddress, setCustomerAddress] = useState('CUSTOMER ADDRESS');
  const [customerPhone, setCustomerPhone] = useState('9000000000');
  const [vehicleNumber, setVehicleNumber] = useState('TN-31-0000');
  const [gstNumber, setGstNumber] = useState('GST123456789');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isEditing, setIsEditing] = useState(true);

  const subtotal = billItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const totalDiscount = isDiscountEnabled ? billItems.reduce((sum, item) => {
    const discount = (item.discountPercentage ?? 0) / 100;
    return sum + (item.service.price * item.quantity * discount);
  }, 0) : 0;
  const totalAfterDiscount = subtotal - totalDiscount;
  const gstAmount = isGstEnabled
    ? billItems.reduce((sum, item) => {
        const itemTotal = item.service.price * item.quantity;
        const discountAmount = isDiscountEnabled ? itemTotal * ((item.discountPercentage ?? 0) / 100) : 0;
        const priceAfterDiscount = itemTotal - discountAmount;
        const gstRate = item.service.gst_percentage ?? 0;
        const itemGst = priceAfterDiscount - (priceAfterDiscount / (1 + gstRate / 100));
        return sum + itemGst;
      }, 0)
    : 0;
  const netAmount = totalAfterDiscount;

  const billNumber = `B${Math.random().toString().substr(2, 6).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleSave = () => {
    const billToSave: SavedBill = {
      billNumber,
      customerName,
      customerAddress,
      customerPhone,
      vehicleNumber: vehicleNumber,
      date: currentDate,
      gstNumber,
      items: billItems.map(item => ({
        description: item.service.name,
        hsnCode: item.service.hsn_code,
        quantity: item.quantity,
        rate: item.service.price,
        taxPercentage: item.service.gst_percentage ?? 0,
        amount: item.service.price * item.quantity,
        discountPercentage: item.discountPercentage,
      })),
      total: subtotal,
      gstAmount,
      sgst_amount: gstAmount / 2,
      cgst_amount: gstAmount / 2,
      netAmount,
      paymentMethod,
    };
    onSaveBill(billToSave);
  };

  const handleSaveAndPrint = () => {
    handleSave();
    window.print();
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
      <div className="bg-slate-800 text-white shadow-md no-print">
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
            <button onClick={handleSaveAndPrint} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2">
              <Printer className="w-5 h-5" />
              <span>Save & Print</span>
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
                <h2 className="text-3xl font-extrabold text-gray-800">SRI CHELLAM AUTOMOBILE</h2>
                <p className="text-sm">No.1, Thirumurugan Nagar, Near J.K. Nagar,</p>
                <p className="text-sm">Khajamalai, Trichy - 23.</p>
                <p className="text-sm">GST: 33AGGPN1093C1ZS</p>
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
                <p><span className="font-bold">Vehicle No:</span>
                  {isEditing ? <input type="text" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} className="p-1 border border-dashed border-gray-400 rounded" data-testid="vehicle-number-input" /> : vehicleNumber}
                </p>
                {isGstEnabled && (
                  <p><span className="font-bold">GST No:</span>
                    {isEditing ? <input type="text" value={gstNumber} onChange={e => setGstNumber(e.target.value)} className="p-1 border border-dashed border-gray-400 rounded" /> : gstNumber}
                  </p>
                )}
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
                  {isDiscountEnabled && <th className="border border-gray-400 p-2">Discount</th>}
                  {isGstEnabled && <th className="border border-gray-400 p-2">SGST/CGST</th>}
                  <th className="border border-gray-400 p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, index) => (
                  <tr key={item.service.id}>
                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-400 p-2">{item.service.name}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.service.hsn_code}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.quantity} Nos</td>
                    <td className="border border-gray-400 p-2 text-right">{item.service.price.toFixed(2)}</td>
                    {isDiscountEnabled && <td className="border border-gray-400 p-2 text-center">{item.discountPercentage ?? 0}%</td>}
                    {isGstEnabled && <td className="border border-gray-400 p-2 text-center">{(item.service.gst_percentage ?? 0) / 2}%+{(item.service.gst_percentage ?? 0) / 2}%</td>}
                    <td className="border border-gray-400 p-2 text-right">{(item.service.price * item.quantity).toFixed(2)}</td>
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
                    <span className="font-bold">Subtotal:</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  {isDiscountEnabled && totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-bold">Discount:</span>
                      <span>- {totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {isGstEnabled && (
                    <>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Includes SGST:</span>
                        <span>{(gstAmount / 2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Includes CGST:</span>
                        <span>{(gstAmount / 2).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-extrabold text-lg border-t-2 border-b-2 border-gray-800 my-1 py-1">
                    <span>Net Amount:</span>
                    <span>{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">Payment Method:</span>
                    {isEditing ? (
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="p-1 border border-dashed border-gray-400 rounded"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                      </select>
                    ) : (
                      <span>{paymentMethod}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 text-right">
              <p className="font-bold">For SRI CHELLAM AUTOMOBILE</p>
              <div className="mt-16 border-t border-dashed border-gray-500 pt-1 inline-block">
                Authorized Signatory
              </div>
            </div>
          </footer>
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
