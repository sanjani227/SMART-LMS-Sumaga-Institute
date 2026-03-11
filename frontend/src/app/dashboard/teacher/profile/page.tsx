"use client";
import { useState, useEffect } from "react";
import { User, BookOpen, Save, Loader2 } from "lucide-react";
import axios from "axios";

interface Teacher {
  teacherId: number;
  fullName: string;
  specialization: string;
  email: string;
}

interface Subject {
  subjectId: number;
  subjectName: string;
  gradeLevel: string;
}

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacherProfile();
    fetchSubjects();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("TOKEN");
      
      const response = await axios.get(
        `http://localhost:3000/api/v1/teachers/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setTeacher(response.data.data);
        setSelectedSubject(response.data.data.specialization || "");
      } else {
        setError(response.data.message || "Failed to fetch profile");
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.message || "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/subjects`
      );

      if (response.data.code === 200) {
        setSubjects(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleUpdateSpecialization = async () => {
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem("TOKEN");
      
      const response = await axios.put(
        `http://localhost:3000/api/v1/teachers/specialization`,
        { specialization: selectedSubject },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setSuccess("Specialization updated successfully!");
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        fetchTeacherProfile(); // Refresh data
      } else {
        setError(response.data.message || "Failed to update specialization");
      }
    } catch (error: any) {
      console.error("Error updating specialization:", error);
      setError(error.response?.data?.message || "Error updating specialization");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading profile...</p>
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
            onClick={fetchTeacherProfile}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-500">Unable to load teacher profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Teacher Profile</h2>
        <p className="text-sm text-gray-500">
          Manage your profile and teaching specialization.
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-800">{teacher.fullName}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center">
              <span className="text-gray-800">{teacher.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialization Update */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Teaching Specialization
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Specialization
            </label>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
              {teacher.specialization || "Not set"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Specialization
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a subject...</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectName}>
                  {subject.subjectName} (Grade {subject.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpdateSpecialization}
            disabled={updating || !selectedSubject || selectedSubject === teacher.specialization}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {updating ? "Updating..." : "Update Specialization"}
          </button>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>You can only teach one subject at a time</li>
          <li>Changing your specialization will affect your class assignments</li>
          <li>Contact administration if you need to add a new subject</li>
        </ul>
      </div>
    </div>
  );
}