"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Save } from "lucide-react";

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
  };
  currentParent: ParentOption | null;
  availableParents: ParentOption[];
}

export default function StudentSettingsPage() {
  const [search, setSearch] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [data, setData] = useState<StudentSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async (keyword?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/settings`,
        {
          params: keyword ? { q: keyword } : {},
          withCredentials: true,
        }
      );

      if (response.data.code === 200) {
        setData(response.data.data);
        setSelectedParentId(
          response.data.data.currentParent?.parentId
            ? String(response.data.data.currentParent.parentId)
            : ""
        );
      } else {
        setError(response.data.message || "Failed to fetch settings");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSettings(search.trim());
  };

  const handleUpdateParent = async () => {
    if (!selectedParentId) {
      setError("Please choose a parent first.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/parent`,
        { parentId: Number(selectedParentId) },
        { withCredentials: true }
      );

      if (response.data.code === 200) {
        setSuccess("Parent updated successfully.");
        await fetchSettings(search.trim());
      } else {
        setError(response.data.message || "Failed to update parent");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating parent");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Student Settings</h2>
        <p className="text-sm text-gray-500">Choose or update your parent profile link.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3">{success}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Current Parent</h3>
        {data?.currentParent ? (
          <div className="text-sm text-gray-700">
            <p className="font-medium">{data.currentParent.fullName}</p>
            <p>{data.currentParent.email}</p>
            <p>{data.currentParent.contact}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No parent linked yet.</p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Parent</h3>

        <div className="flex gap-2 mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parent by name or email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <select
          value={selectedParentId}
          onChange={(e) => setSelectedParentId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">Choose parent...</option>
          {(data?.availableParents || []).map((parent) => (
            <option key={parent.parentId} value={parent.parentId}>
              {parent.fullName} ({parent.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdateParent}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Update Parent"}
        </button>
      </div>
    </div>
  );
}
