"use client";
import { useState, useEffect } from "react";
import { User, Phone, Save, Loader2, RefreshCw, Link2, UserPlus, Users } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Parent {
  parentId: number;
  fullName: string;
  contact: string;
  email: string;
}

export default function ParentProfilePage() {
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Link Student State
  const [studentEmail, setStudentEmail] = useState("");
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    fetchParentProfile();
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/children`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200 && response.data.data) {
        setChildren(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const fetchParentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("TOKEN");
      
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setParent(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch profile. You might need to sync your account.");
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.message || "Error fetching profile. You might need to sync your account first.");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncProfile = async () => {
    try {
      setSyncing(true);
      
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/sync`
      );

      if (response.data.code === 200) {
        toast.success("Profile synchronized successfully!");
        fetchParentProfile(); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to sync profile");
      }
    } catch (error: any) {
      console.error("Error syncing profile:", error);
      toast.error(error.response?.data?.message || "Error syncing profile");
    } finally {
      setSyncing(false);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) {
      toast.error("Please enter a student email");
      return;
    }

    try {
      setLinking(true);
      const token = localStorage.getItem("TOKEN");
      
      const response = await axios.post(
        `http://localhost:3000/api/v1/parents/link-student`,
        { studentEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200) {
        toast.success("Student linked successfully!");
        setStudentEmail("");
        fetchChildren(); // Refresh the list of children
      } else {
        toast.error(response.data.message || "Failed to link student");
      }
    } catch (error: any) {
      console.error("Error linking student:", error);
      toast.error(error.response?.data?.message || "Error linking student");
    } finally {
      setLinking(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Parent Profile</h2>
          <p className="text-sm text-gray-500">
            View your profile details and synchronize your account.
          </p>
        </div>
        <button
          onClick={handleSyncProfile}
          disabled={syncing}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? "Syncing..." : "Sync Profile"}
        </button>
      </div>

      {error && !parent && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <User className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-800 font-medium mb-2">{error}</p>
          <p className="text-sm text-red-600 mb-4">Please click the 'Sync Profile' button above to initialize your parent account data.</p>
        </div>
      )}

      {/* Profile Information */}
      {parent && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-3">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Full Name
              </label>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-gray-800 font-medium text-lg">{parent.fullName}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Email Address
              </label>
              <div className="flex items-center">
                <span className="text-gray-800 font-medium">{parent.email}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Contact Number
              </label>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-gray-800 font-medium">{parent.contact || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Linked Children & Add Child Section */}
      {parent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Linked Children List */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              Linked Children
            </h3>
            
            {children.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No children linked to your account yet.</p>
                <p className="text-gray-400 text-xs mt-1">Use the form to link a student.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {children.map((child) => (
                  <div key={child.studentId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{child.fullName}</p>
                        <p className="text-xs text-gray-500">Grade: {child.grade || "N/A"}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                      Linked
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link New Student Form */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-gray-400" />
              Link a Student
            </h3>
            
            <form onSubmit={handleLinkStudent} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Enter the email address registered to your child's student account to link them to your parent profile.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. student@school.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={linking || !studentEmail.trim()}
                className="w-full flex items-center justify-center px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                {linking ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-5 h-5 mr-2" />
                )}
                {linking ? "Linking Student..." : "Link Student"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          Information
        </h4>
        <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
          <li>If your details are missing, clicking the "Sync Profile" button will import your data from your registration account.</li>
          <li>Your email address is currently used as your default contact method.</li>
          <li>If you need to update your contact number or name, please contact the school administration.</li>
        </ul>
      </div>
    </div>
  );
}
