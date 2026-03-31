'use client';

import { Settings, User, Bell, Shield, Globe, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SettingsPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [activeModal, setActiveModal] = useState<"profile" | "security" | "notifications" | "system" | null>(null);

  // Form States
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '' });
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notificationsForm, setNotificationsForm] = useState({ emailAlerts: true, loginAlerts: false, weeklyReports: true });
  const [systemForm, setSystemForm] = useState({ theme: 'light', language: 'en', timezone: 'UTC' });

  // Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/auth/me", { withCredentials: true });
      if (res.data.code === 200) {
        const user = res.data.data;
        setUserData(user);
        setProfileForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
        
        if (user.notifications) setNotificationsForm(user.notifications);
        if (user.systemPreferences) setSystemForm(user.systemPreferences);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put("http://localhost:3000/api/v1/auth/updateProfile", profileForm, { withCredentials: true });
      showMessage('success', 'Profile updated successfully!');
      fetchUserData();
      setTimeout(() => setActiveModal(null), 1000);
    } catch (error: any) {
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      return showMessage('error', 'New passwords do not match');
    }
    setIsSubmitting(true);
    try {
      await axios.put("http://localhost:3000/api/v1/auth/updatePassword", {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword
      }, { withCredentials: true });
      showMessage('success', 'Password changed successfully!');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setActiveModal(null), 1000);
    } catch (error: any) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent, type: 'notifications' | 'system') => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = type === 'notifications' 
        ? { notifications: notificationsForm } 
        : { systemPreferences: systemForm };
        
      await axios.put("http://localhost:3000/api/v1/auth/updatePreferences", payload, { withCredentials: true });
      showMessage('success', `${type === 'notifications' ? 'Notifications' : 'System preferences'} updated successfully!`);
      fetchUserData();
      setTimeout(() => setActiveModal(null), 1000);
    } catch (error: any) {
      showMessage('error', error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-orange-600" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-400 text-sm">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Account Settings</h3>
                <p className="text-sm text-gray-500">Manage your profile and preferences</p>
              </div>
            </div>
            <div className="mb-4 text-sm text-gray-600">
               <p><strong>Name:</strong> {userData?.firstName} {userData?.lastName}</p>
               <p><strong>Email:</strong> {userData?.email}</p>
            </div>
          </div>
          <button onClick={() => setActiveModal('profile')} className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition">
            Edit Profile
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Bell className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-500">Configure notification preferences</p>
              </div>
            </div>
          </div>
          <button onClick={() => setActiveModal('notifications')} className="w-full mt-4 px-4 py-2 bg-orange-50 text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition">
            Manage Notifications
          </button>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
             <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Shield className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Security</h3>
                <p className="text-sm text-gray-500">Password and security settings</p>
              </div>
            </div>
          </div>
          <button onClick={() => setActiveModal('security')} className="w-full mt-4 px-4 py-2 bg-green-50 text-green-600 font-semibold rounded-lg hover:bg-green-100 transition">
            Security Settings
          </button>
        </div>

        {/* System Preferences */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Globe className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">System Preferences</h3>
                <p className="text-sm text-gray-500">Language, timezone, and display</p>
              </div>
            </div>
            <div className="mb-4 text-sm text-gray-600 space-y-1">
               <p>Language: <strong>{systemForm.language.toUpperCase()}</strong></p>
               <p>Timezone: <strong>{systemForm.timezone}</strong></p>
            </div>
          </div>
          <button onClick={() => setActiveModal('system')} className="w-full mt-4 px-4 py-2 bg-purple-50 text-purple-600 font-semibold rounded-lg hover:bg-purple-100 transition">
            System Settings
          </button>
        </div>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setActiveModal(null); setMessage({type:'', text:''}); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            {/* PROFILE MODAL */}
            {activeModal === 'profile' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><User className="text-blue-600"/> Edit Profile</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">First Name</label>
                    <input type="text" value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                    <input type="text" value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition mt-4 flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
                  </button>
                </form>
              </>
            )}

            {/* SECURITY MODAL */}
            {activeModal === 'security' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Shield className="text-green-600"/> Security Settings</h3>
                <form onSubmit={handleSecuritySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Current Password</label>
                    <input type="password" value={securityForm.currentPassword} onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">New Password</label>
                    <input type="password" value={securityForm.newPassword} onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" required minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                    <input type="password" value={securityForm.confirmPassword} onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" required minLength={6} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition mt-4 flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                  </button>
                </form>
              </>
            )}

            {/* NOTIFICATIONS MODAL */}
            {activeModal === 'notifications' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Bell className="text-orange-600"/> Manage Notifications</h3>
                <form onSubmit={(e) => handlePreferencesSubmit(e, 'notifications')} className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div>
                      <h4 className="font-bold text-gray-800">Email Alerts</h4>
                      <p className="text-xs text-gray-500">Receive crucial system alerts via email.</p>
                    </div>
                    <input type="checkbox" checked={notificationsForm.emailAlerts} onChange={e => setNotificationsForm({...notificationsForm, emailAlerts: e.target.checked})} className="w-5 h-5 accent-orange-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div>
                      <h4 className="font-bold text-gray-800">Security Login Alerts</h4>
                      <p className="text-xs text-gray-500">Get notified of new login attempts.</p>
                    </div>
                    <input type="checkbox" checked={notificationsForm.loginAlerts} onChange={e => setNotificationsForm({...notificationsForm, loginAlerts: e.target.checked})} className="w-5 h-5 accent-orange-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div>
                      <h4 className="font-bold text-gray-800">Weekly Summary Reports</h4>
                      <p className="text-xs text-gray-500">A weekly PDF breakdown of system activity.</p>
                    </div>
                    <input type="checkbox" checked={notificationsForm.weeklyReports} onChange={e => setNotificationsForm({...notificationsForm, weeklyReports: e.target.checked})} className="w-5 h-5 accent-orange-600" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition mt-4 flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Preferences"}
                  </button>
                </form>
              </>
            )}

            {/* SYSTEM PREFERENCES MODAL */}
            {activeModal === 'system' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Globe className="text-purple-600"/> System Preferences</h3>
                <form onSubmit={(e) => handlePreferencesSubmit(e, 'system')} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">UI Theme</label>
                    <select value={systemForm.theme} onChange={e => setSystemForm({...systemForm, theme: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200" required>
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-700">System Language</label>
                    <select value={systemForm.language} onChange={e => setSystemForm({...systemForm, language: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200" required>
                      <option value="en">English (US)</option>
                      <option value="si">Sinhala</option>
                      <option value="ta">Tamil</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-700">Timezone</label>
                    <select value={systemForm.timezone} onChange={e => setSystemForm({...systemForm, timezone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200" required>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="Asia/Colombo">Asia/Colombo (Sri Lanka)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition mt-4 flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save System Settings"}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
