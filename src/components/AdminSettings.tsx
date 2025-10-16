import React, { useState } from 'react';
import { ArrowLeft, Shield, Percent } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultGstPercentage } from '../data/mockData';

interface AdminSettingsProps {
  onBack: () => void;
}

export function AdminSettings({ onBack }: AdminSettingsProps) {
  const [isGstEnabled, setIsGstEnabled] = useLocalStorage<boolean>('is-gst-enabled', true);
  const [gstPercentage, setGstPercentage] = useLocalStorage<number>('car-wash-gst', defaultGstPercentage);
  const [isDiscountEnabled, setIsDiscountEnabled] = useLocalStorage<boolean>('is-discount-enabled', true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // In a real app, you'd fetch the current password securely
    const storedCreds = JSON.parse(localStorage.getItem('admin-credentials') || '{"username":"admin","password":"admin123"}');

    if (currentPassword !== storedCreds.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Save new credentials
    const newCreds = { ...storedCreds, password: newPassword };
    localStorage.setItem('admin-credentials', JSON.stringify(newCreds));

    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-700 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 mb-4 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Admin Panel</span>
          </button>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* GST Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Percent className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">GST Configuration</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="gst-toggle" className="text-slate-700 font-medium">Enable GST</label>
              <div
                onClick={() => setIsGstEnabled(!isGstEnabled)}
                className={`relative w-14 h-8 flex items-center rounded-full cursor-pointer transition-colors ${isGstEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                data-testid="gst-toggle"
              >
                <span className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isGstEnabled ? 'translate-x-7' : 'translate-x-1'}`}></span>
              </div>
            </div>
            {isGstEnabled && (
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-slate-700">GST Percentage:</label>
                <input
                  type="number"
                  value={gstPercentage}
                  onChange={(e) => setGstPercentage(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  min="0"
                  max="50"
                  step="0.1"
                />
                <span className="text-sm text-slate-600">%</span>
              </div>
            )}
          </div>

          {/* Discount Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Percent className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Discount Configuration</h2>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="discount-toggle" className="text-slate-700 font-medium">Enable Discounts</label>
              <div
                onClick={() => setIsDiscountEnabled(!isDiscountEnabled)}
                className={`relative w-14 h-8 flex items-center rounded-full cursor-pointer transition-colors ${isDiscountEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                data-testid="discount-toggle"
              >
                <span className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isDiscountEnabled ? 'translate-x-7' : 'translate-x-1'}`}></span>
              </div>
            </div>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                  required
                  data-testid="current-password-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                  required
                  data-testid="new-password-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                  data-testid="confirm-password-input"
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {passwordSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
  data-testid="update-password-button"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}