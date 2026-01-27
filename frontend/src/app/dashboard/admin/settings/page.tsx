'use client';

import { Settings, User, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-400 text-sm">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Account Settings</h3>
              <p className="text-sm text-gray-500">Manage your profile and preferences</p>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition">
            Edit Profile
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Bell className="text-orange-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Notifications</h3>
              <p className="text-sm text-gray-500">Configure notification preferences</p>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-orange-50 text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition">
            Manage Notifications
          </button>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Shield className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Security</h3>
              <p className="text-sm text-gray-500">Password and security settings</p>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-green-50 text-green-600 font-semibold rounded-lg hover:bg-green-100 transition">
            Security Settings
          </button>
        </div>

        {/* System Preferences */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Globe className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">System Preferences</h3>
              <p className="text-sm text-gray-500">Language, timezone, and display</p>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-purple-50 text-purple-600 font-semibold rounded-lg hover:bg-purple-100 transition">
            System Settings
          </button>
        </div>
      </div>
    </div>
  );
}
