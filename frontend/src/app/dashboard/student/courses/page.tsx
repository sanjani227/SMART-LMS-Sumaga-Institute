"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, User, BookOpen, GraduationCap } from "lucide-react";
import axios from "axios";

interface Class {
  classId: number;
  subject: {
    subjectId: number;
    subjectName: string;
    gradeLevel: string;
  };
  teacher: {
    teacherId: number;
    fullName: string;
  };
  scheduleDay: string;
  scheduleTime: string;
  enrollmentStatus: string;
  enrollmentDate: string;
}

interface StudentData {
  studentId: number;
  fullName: string;
  grade: string;
  classes: Class[];
}

export default function StudentCourses() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentClasses();
  }, []);

  const fetchStudentClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setStudentData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch classes");
      }
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      setError(error.response?.data?.message || "Error fetching classes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading your classes...</p>
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
            onClick={fetchStudentClasses}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!studentData || studentData.classes.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Enrolled</h3>
          <p className="text-gray-500">You are not enrolled in any classes yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Classes</h2>
        <p className="text-sm text-gray-500">
          Welcome {studentData.fullName} | Grade {studentData.grade}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800">
                {studentData.classes.length}
              </h3>
              <p className="text-sm text-blue-600">Enrolled Classes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800">
                {new Set(studentData.classes.map(c => c.teacher.teacherId)).size}
              </h3>
              <p className="text-sm text-green-600">Teachers</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-purple-800">
                {studentData.grade}
              </h3>
              <p className="text-sm text-purple-600">Current Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentData.classes.map((classInfo) => (
          <div 
            key={classInfo.classId} 
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {classInfo.subject.subjectName}
                </h3>
                <p className="text-sm text-gray-500">
                  Grade {classInfo.subject.gradeLevel}
                </p>
              </div>
              <span 
                className={`px-2 py-1 text-xs rounded-full ${
                  classInfo.enrollmentStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {classInfo.enrollmentStatus}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                {classInfo.teacher.fullName}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {classInfo.scheduleDay}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {classInfo.scheduleTime}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Enrolled: {new Date(classInfo.enrollmentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
