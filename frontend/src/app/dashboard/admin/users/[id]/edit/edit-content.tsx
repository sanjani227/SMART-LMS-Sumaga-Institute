'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';

export function EditUserContent() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'student',
    isDeleted: false,
    specialization: ''
  });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchSubjects();
    }
  }, [userId]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subjects/getSubjects`);
      if (response.data.data) {
        const baseSubjects = Array.from(new Set(response.data.data.map((s: any) => s.subjectName.split(' (Grade')[0])));
        setSubjects(baseSubjects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/users/${userId}`);
      if (res.data.code === 200) {
        const u = res.data.data;
        setFormData({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          userType: u.userType || 'student',
          isDeleted: u.isDeleted || false,
          specialization: u.teacherProfile?.specialization || ''
        });
      } else {
        setError('Failed to load user.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error occurred while loading form.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'status') {
      setFormData(prev => ({ ...prev, isDeleted: value === 'inactive' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/users/${userId}`, formData);
      if (res.data.code === 200) {
        router.push('/dashboard/admin/users');
      } else {
        setError(res.data.message || 'Update failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-gray-500">Loading user details...</div>;
  }

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
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>
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
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Teacher Specialization */}
          {formData.userType === 'teacher' && (
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Teaching Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
              >
                <option value="">Select a specialization...</option>
                {subjects.map((sub, idx) => (
                  <option key={idx} value={sub as string}>{sub as string}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Status</label>
            <select
              name="status"
              value={formData.isDeleted ? 'inactive' : 'active'}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-50 transition border-solid"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
