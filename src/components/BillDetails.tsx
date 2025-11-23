import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { SavedBill } from '../types';

interface BillDetailsProps {
  bill: SavedBill;
  onBack: () => void;
  isGstEnabled: boolean;
}

export function BillDetails({ bill, onBack, isGstEnabled }: BillDetailsProps) {

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
            <span>Back to Bill Records</span>
          </button>
          <h1 className="text-2xl font-bold">Bill Details</h1>
          <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2">
            <Printer className="w-5 h-5" />
            <span>Print Bill</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div id="bill-content" className="bg-white p-8 border border-gray-300 shadow-lg rounded-lg max-w-4xl mx-auto">
          <header className="flex justify-between items-start pb-4 border-b-2 border-gray-800">
            <div className="flex items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800">Nagu Car Spa</h2>
                <p className="text-sm">No.1, Thirumurugan Nagar, Near J.K. Nagar,</p>
                <p className="text-sm">Khajamalai, Trichy - 23.</p>
                <p className="text-sm">HP: 81221 91515</p>
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
                <p className="font-semibold">{bill.customerName}</p>
                <p>{bill.customerAddress}</p>
                <p>Ph: {bill.customerPhone}</p>
              </div>
              <div className="w-1/2 pl-4 text-right">
                <p><span className="font-bold">Bill No:</span> {bill.billNumber}</p>
                <p><span className="font-bold">Date:</span> {bill.date}</p>
                <p><span className="font-bold">Vehicle:</span> {bill.vehicleNumber}</p>
                {bill.paymentMethod && <p><span className="font-bold">Payment Method:</span> {bill.paymentMethod}</p>}
                {isGstEnabled && <p><span className="font-bold">GST No:</span> {bill.gstNumber}</p>}
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
                  {isGstEnabled && <th colSpan={2} className="border border-gray-400 p-2">GST</th>}
                  <th className="border border-gray-400 p-2">Amount</th>
                </tr>
                {isGstEnabled && (
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 p-2" colSpan={5}></th>
                    <th className="border border-gray-400 p-2">SGST%</th>
                    <th className="border border-gray-400 p-2">CGST%</th>
                    <th className="border border-gray-400 p-2"></th>
                  </tr>
                )}
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-400 p-2">{item.description}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.hsnCode}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.quantity} Nos</td>
                    <td className="border border-gray-400 p-2 text-right">{item.rate.toFixed(2)}</td>
                    {isGstEnabled && <td className="border border-gray-400 p-2 text-center">{(item.taxPercentage / 2).toFixed(2)}%</td>}
                    {isGstEnabled && <td className="border border-gray-400 p-2 text-center">{(item.taxPercentage / 2).toFixed(2)}%</td>}
                    <td className="border border-gray-400 p-2 text-right">{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 10 - bill.items.length) }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-gray-400 p-2 h-8"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    {isGstEnabled && <td className="border border-gray-400 p-2"></td>}
                    {isGstEnabled && <td className="border border-gray-400 p-2"></td>}
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
                <p><span className="font-bold">Total Qty:</span> {bill.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="font-bold">Rupees {numberToWords(Math.round(bill.netAmount))}</p>
              </div>
              <div className="w-1/3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span>{bill.total.toFixed(2)}</span>
                  </div>
                  {isGstEnabled && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-bold">SGST:</span>
                        <span>{bill.sgst_amount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">CGST:</span>
                        <span>{bill.cgst_amount?.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-extrabold text-lg border-t-2 border-b-2 border-gray-800 my-1 py-1">
                    <span>Net Amount:</span>
                    <span>{bill.netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 text-right">
              <p className="font-bold">For Nagu Car Spa</p>
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
