'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { UserType } from '@/src/utils/enum';

export function EditUserContent() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [formData, setFormData] = useState({
    name: 'Sanjani',
    email: 'sanjanimapa@gmail.com',
    UserType: 'Teacher',
    status: 'Active'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Updating user:', userId, formData);
      router.push('/dashboard/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
          <p className="text-gray-500 text-sm">Update user information</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Role</label>
            <select
              name="role"
              value={formData.UserType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            >
              <option>Teacher</option>
              <option>Student</option>
              <option>Parent</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            >
              <option value= "active">Active</option>
              <option value= "inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
