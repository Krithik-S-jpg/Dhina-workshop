import React from 'react';
import { Service } from '../types';
import { AlertTriangle } from 'lucide-react';

interface NotificationsProps {
  lowStockServices: Service[];
}

export function Notifications({ lowStockServices }: NotificationsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <AlertTriangle className="w-8 h-8 text-yellow-500" />
        <h2 className="text-2xl font-bold text-slate-800">Low Stock Alerts</h2>
      </div>

      {lowStockServices.length > 0 ? (
        <div className="space-y-4">
          {lowStockServices.map(service => (
            <div key={service.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-yellow-800">{service.name}</p>
                <p className="text-sm text-yellow-700">
                  Current stock is critically low.
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-800">{service.stock}</p>
                <p className="text-xs text-yellow-600">units left</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700">All Good!</h3>
          <p className="text-slate-500 mt-2">
            There are no low stock alerts at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
