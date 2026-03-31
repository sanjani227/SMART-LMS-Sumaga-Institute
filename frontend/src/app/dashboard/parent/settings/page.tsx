"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Link2, Users } from "lucide-react";

interface StudentItem {
  studentId: number;
  fullName: string;
  grade: string | null;
  user?: {
    email?: string;
  };
}

interface ParentSettingsData {
  parent: {
    parentId: number;
    fullName: string;
    email: string;
    contact: string;
  };
  linkedStudents: StudentItem[];
  availableStudents: StudentItem[];
}

export default function ParentSettingsPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<ParentSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkingId, setLinkingId] = useState<number | null>(null);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/settings`,
        {
          params: keyword ? { q: keyword } : {},
          withCredentials: true,
        }
      );

      if (response.data.code === 200) {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch parent settings");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching parent settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSettings(search.trim());
  };

  const handleLinkChild = async (studentId: number) => {
    try {
      setLinkingId(studentId);
      setError(null);
      setSuccess(null);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/children/link`,
        { studentId },
        { withCredentials: true }
      );

      if (response.data.code === 200) {
        setSuccess("Child linked successfully.");
        await fetchSettings(search.trim());
      } else {
        setError(response.data.message || "Failed to link child");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error linking child");
    } finally {
      setLinkingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Parent Settings</h2>
        <p className="text-sm text-gray-500">Link your account to student profiles.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3">{success}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Linked Children</h3>
        {!data?.linkedStudents?.length ? (
          <p className="text-sm text-gray-500">No child linked yet.</p>
        ) : (
          <div className="space-y-2">
            {data.linkedStudents.map((student) => (
              <div key={student.studentId} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800">{student.fullName}</p>
                  <p className="text-xs text-gray-500">Grade {student.grade || "N/A"} • {student.user?.email || "No email"}</p>
                </div>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Students</h3>

        <div className="flex gap-2 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {!data?.availableStudents?.length ? (
          <p className="text-sm text-gray-500">No available students to link.</p>
        ) : (
          <div className="space-y-2">
            {data.availableStudents.map((student) => (
              <div key={student.studentId} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800">{student.fullName}</p>
                  <p className="text-xs text-gray-500">Grade {student.grade || "N/A"} • {student.user?.email || "No email"}</p>
                </div>
                <button
                  onClick={() => handleLinkChild(student.studentId)}
                  disabled={linkingId === student.studentId}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                >
                  <Link2 className="w-4 h-4" />
                  {linkingId === student.studentId ? "Linking..." : "Link"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
