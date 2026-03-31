"use client";
import { useState, useEffect } from "react";
import { User, Users, Calendar, CreditCard, TrendingUp, Clock } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface Child {
  studentId: number;
  fullName: string;
  grade: string;
  dob: string;
  address: string;
}

interface Parent {
  parentId: number;
  fullName: string;
  contact: string;
  email: string;
}

export default function ParentDashboard() {
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultChildId = children[0]?.studentId;

  useEffect(() => {
    fetchParentProfile();
    fetchChildren();
  }, []);

  const fetchParentProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/profile`,
        {
          withCredentials: true,
        }
      );

      if (response.data.code === 200) {
        setParent(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching parent profile:", error);
      setError(error.response?.data?.message || "Error fetching parent profile");
    }
  };

  const fetchChildren = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/children`,
        {
          withCredentials: true,
        }
      );

      if (response.data.code === 200) {
        setChildren(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch children");
      }
    } catch (error: any) {
      console.error("Error fetching children:", error);
      setError(error.response?.data?.message || "Error fetching children");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={() => {
              fetchParentProfile();
              fetchChildren();
            }}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Children Found</h3>
          <p className="text-gray-500">No children are linked to your account yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Parent Dashboard</h2>
        <p className="text-sm text-gray-500">
          Welcome {parent?.fullName || "Parent"} | Monitor your children's progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800">
                {children.length}
              </h3>
              <p className="text-sm text-blue-600">Children</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800">
                {new Date().toLocaleDateString()}
              </h3>
              <p className="text-sm text-green-600">Today</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-800">
                Track
              </h3>
              <p className="text-sm text-yellow-600">Payments</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-purple-800">
                View
              </h3>
              <p className="text-sm text-purple-600">Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Children Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Children</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <div 
              key={child.studentId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">{child.fullName}</h4>
                  <p className="text-sm text-gray-500">Grade {child.grade}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {child.fullName.charAt(0)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {child.dob && (
                  <p className="text-xs text-gray-500">
                    Born: {new Date(child.dob).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href={`/dashboard/parent/child-attendance?studentId=${child.studentId}`}
                  className="flex flex-col items-center p-2 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Clock className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs text-blue-600">Attendance</span>
                </Link>

                <Link
                  href={`/dashboard/parent/child-payments?studentId=${child.studentId}`}
                  className="flex flex-col items-center p-2 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-green-600 mb-1" />
                  <span className="text-xs text-green-600">Payments</span>
                </Link>

                <Link
                  href={`/dashboard/parent/child-progress?studentId=${child.studentId}`}
                  className="flex flex-col items-center p-2 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                >
                  <TrendingUp className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="text-xs text-purple-600">Progress</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href={
              defaultChildId
                ? `/dashboard/parent/child-attendance?studentId=${defaultChildId}`
                : "/dashboard/parent/child-attendance"
            }
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-800">Check Attendance</h4>
            <p className="text-sm text-gray-500">View your children's attendance records</p>
          </Link>

          <Link 
            href={
              defaultChildId
                ? `/dashboard/parent/child-payments?studentId=${defaultChildId}`
                : "/dashboard/parent/child-payments"
            }
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CreditCard className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-800">Payment History</h4>
            <p className="text-sm text-gray-500">Track fees and payment status</p>
          </Link>

          <Link 
            href={
              defaultChildId
                ? `/dashboard/parent/child-progress?studentId=${defaultChildId}`
                : "/dashboard/parent/child-progress"
            }
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-800">Academic Progress</h4>
            <p className="text-sm text-gray-500">Monitor grades and performance</p>
          </Link>
        </div>
      </div>
    </div>
  );
}