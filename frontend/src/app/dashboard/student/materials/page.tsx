"use client";
import { useState, useEffect } from "react";
import { FileText, Download, BookOpen, User, Calendar, GraduationCap } from "lucide-react";
import axios from "axios";

interface StudyMaterial {
  fileId: number;
  fileName: string;
  grade: string;
  subject: {
    subjectId: number;
    subjectName: string;
    gradeLevel: string;
  };
  teacher: {
    teacherId: number;
    fullName: string;
  };
  createdAt: string;
  title?: string;
}

export default function StudentMaterials() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  const fetchStudyMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/materials`,
        {
          withCredentials: true
        }
      );

      if (response.data.code === 200) {
        setMaterials(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch materials");
      }
    } catch (error: any) {
      console.error("Error fetching materials:", error);
      setError(error.response?.data?.message || "Error fetching materials");
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || "FILE";
  };

  const handleDownload = (fileName: string) => {
    // Create download link for file
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileName}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading study materials...</p>
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
            onClick={fetchStudyMaterials}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Materials</h3>
          <p className="text-gray-500">No study materials available for your grade yet.</p>
        </div>
      </div>
    );
  }

  // Group materials by subject
  const materialsBySubject = materials.reduce((acc, material) => {
    const subject = material.subject.subjectName;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(material);
    return acc;
  }, {} as Record<string, StudyMaterial[]>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>
        <p className="text-sm text-gray-500">
          Download and review shared resources from your teachers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800">
                {materials.length}
              </h3>
              <p className="text-sm text-blue-600">Total Materials</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800">
                {Object.keys(materialsBySubject).length}
              </h3>
              <p className="text-sm text-green-600">Subjects</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-purple-800">
                {new Set(materials.map(m => m.teacher.teacherId)).size}
              </h3>
              <p className="text-sm text-purple-600">Teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Materials by Subject */}
      <div className="space-y-6">
        {Object.entries(materialsBySubject).map(([subject, subjectMaterials]) => (
          <div key={subject} className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {subject}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectMaterials.map((material) => (
                <div 
                  key={material.fileId}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">
                        {material.title || material.fileName}
                      </h4>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {material.teacher.fullName}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Grade {material.grade}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {getFileExtension(material.fileName)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Added {new Date(material.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDownload(material.fileName)}
                      className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
