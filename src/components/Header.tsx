import React from 'react';
import { Car, Settings } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  showAdminButton?: boolean;
  isGstEnabled?: boolean;
  onGstToggle?: () => void;
}

export function Header({
  onAdminClick,
  showAdminButton = true,
  isGstEnabled,
  onGstToggle,
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
              <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-600">
                <span className="text-sm font-medium text-slate-200">GST</span>
                <button
                  type="button"
                  onClick={onGstToggle}
                  aria-label="Toggle GST"
                  className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
                    isGstEnabled ? 'bg-blue-600' : 'bg-gray-500'
                  }`}
                  data-testid="header-gst-toggle"
                >
                  <span
                    className={`inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      isGstEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold px-1 py-0.5 rounded text-white min-w-[32px] text-center">
                  {isGstEnabled ? 'ON' : 'OFF'}
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