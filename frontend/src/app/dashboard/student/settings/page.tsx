"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Save, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ParentOption {
  parentId: number;
  fullName: string;
  contact: string;
  email: string;
}

interface StudentSettingsData {
  student: {
    studentId: number;
    fullName: string;
    grade: string | null;
    email: string;
    contact: string | null;
  };
  currentParent: ParentOption | null;
  availableParents: ParentOption[];
}

export default function StudentSettingsPage() {
  const [search, setSearch] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [data, setData] = useState<StudentSettingsData | null>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
      fullName: "",
      email: "",
      contact: ""
  });

  const [loading, setLoading] = useState(true);
  const [savingParent, setSavingParent] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async (keyword?: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/settings`,
        {
          params: keyword ? { q: keyword } : {},
          withCredentials: true,
        }
      );

      if (response.data.code === 200) {
        setData(response.data.data);
        setProfileForm({
            fullName: response.data.data.student.fullName || "",
            email: response.data.data.student.email || "",
            contact: response.data.data.student.contact || ""
        });
        setSelectedParentId(
          response.data.data.currentParent?.parentId
            ? String(response.data.data.currentParent.parentId)
            : ""
        );
      } else {
        toast.error(response.data.message || "Failed to fetch settings");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSettings(search.trim());
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.fullName || !profileForm.email) {
        toast.error("Full Name and Email are required fields.");
        return;
    }

    try {
        setSavingProfile(true);
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/profile`,
            profileForm,
            { withCredentials: true }
        );

        if (response.data.code === 200) {
            toast.success("Profile updated successfully.");
            await fetchSettings(search.trim());
        } else {
            toast.error(response.data.message || "Failed to update profile");
        }
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Error updating profile");
    } finally {
        setSavingProfile(false);
    }
  };


  const handleUpdateParent = async () => {
    if (!selectedParentId) {
      toast.error("Please choose a parent first.");
      return;
    }

    try {
      setSavingParent(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/parent`,
        { parentId: Number(selectedParentId) },
        { withCredentials: true }
      );

      if (response.data.code === 200) {
        toast.success("Parent updated successfully.");
        await fetchSettings(search.trim());
      } else {
        toast.error(response.data.message || "Failed to update parent");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating parent");
    } finally {
      setSavingParent(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Student Settings</h2>
        <p className="text-sm text-gray-500">Manage your profile details and parent link.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <User className="text-indigo-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
        </div>
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input 
                        type="text" 
                        value={profileForm.contact}
                        onChange={(e) => setProfileForm({...profileForm, contact: e.target.value})}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>
            
            <div className="pt-2">
                <button
                onClick={handleUpdateProfile}
                disabled={savingProfile}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                >
                <Save className="w-4 h-4" />
                {savingProfile ? "Saving Profile..." : "Save Changes"}
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Linked Parent Account</h3>
        </div>
        
        <div className="p-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Current Parent</h4>
                {data?.currentParent ? (
                <div className="text-sm text-blue-900 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <p><span className="font-semibold text-blue-700">Name:</span> {data.currentParent.fullName}</p>
                    <p><span className="font-semibold text-blue-700">Email:</span> {data.currentParent.email}</p>
                    <p><span className="font-semibold text-blue-700">Contact:</span> {data.currentParent.contact}</p>
                </div>
                ) : (
                <p className="text-sm text-blue-700">No parent linked to this account yet.</p>
                )}
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Change Linked Parent</h4>

                <div className="flex gap-2">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search available parents by name or email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center justify-center"
                >
                    <Search className="w-4 h-4" />
                </button>
                </div>

                <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                <option value="">-- Choose a parent to link --</option>
                {(data?.availableParents || []).map((parent) => (
                    <option key={parent.parentId} value={parent.parentId}>
                    {parent.fullName} ({parent.email})
                    </option>
                ))}
                </select>

                <div className="pt-2">
                    <button
                    onClick={handleUpdateParent}
                    disabled={savingParent}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-60"
                    >
                    <Save className="w-4 h-4" />
                    {savingParent ? "Updating..." : "Update Parent Link"}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
