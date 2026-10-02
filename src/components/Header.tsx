import React from 'react';
import { Car, Settings } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  showAdminButton?: boolean;
  isGstEnabled?: boolean;
  onGstToggle?: () => void;
  isDiscountEnabled?: boolean;
  onDiscountToggle?: () => void;
}

export function Header({
  onAdminClick,
  showAdminButton = true,
  isGstEnabled,
  onGstToggle,
  isDiscountEnabled,
  onDiscountToggle,
}: HeaderProps) {
  return (
    <header className="bg-slate-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Dhina Automobiles</h1>
          </div>
          <div className="flex items-center space-x-4">
            {onGstToggle !== undefined && isGstEnabled !== undefined && (
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-600">
                <span className="text-sm font-medium select-none">GST:</span>
                <button
                  type="button"
                  onClick={onGstToggle}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isGstEnabled ? 'bg-blue-600' : 'bg-gray-500'
                  }`}
                  data-testid="outer-gst-toggle"
                  aria-label="Toggle GST"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isGstEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold px-1 min-w-[30px]">
                  {isGstEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            )}
            {onDiscountToggle !== undefined && isDiscountEnabled !== undefined && (
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-600">
                <span className="text-sm font-medium select-none">Discount:</span>
                <button
                  type="button"
                  onClick={onDiscountToggle}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isDiscountEnabled ? 'bg-blue-600' : 'bg-gray-500'
                  }`}
                  data-testid="outer-discount-toggle"
                  aria-label="Toggle Discount"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDiscountEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold px-1 min-w-[30px]">
                  {isDiscountEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            )}
            {showAdminButton && (
              <button
                onClick={onAdminClick}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                data-testid="admin-login-button"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}