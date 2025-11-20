import React from 'react';
import { Car, Settings } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  showAdminButton?: boolean;
}

export function Header({ onAdminClick, showAdminButton = true }: HeaderProps) {
  return (
    <header className="bg-slate-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Nagu Automobiles</h1>
          </div>
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
    </header>
  );
}