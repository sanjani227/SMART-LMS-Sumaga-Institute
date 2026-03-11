"use client";
import { useState, useEffect } from "react";
import { Plus, Calendar, Users, Edit, Eye, GraduationCap, Clock } from "lucide-react";
import axios from "axios";

interface Assignment {
  assignmentId: number;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionCount: number;
  class: {
    classId: number;
    subject: {
      subjectName: string;
      gradeLevel: string;
    };
    scheduleDay: string;
    scheduleTime: string;
  };
  createdAt: string;
}

interface Class {
  classId: number;
  subject: {
    subjectId: number;
    subjectName: string;
    gradeLevel: string;
  };
  scheduleDay: string;
  scheduleTime: string;
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newAssignment, setNewAssignment] = useState({
    classId: "",
    title: "",
    description: "",
    dueDate: "",
    maxScore: 100,
  });

  useEffect(() => {
    fetchAssignments();
    fetchTeacherClasses();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setAssignments(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch assignments");
      }
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
      setError(error.response?.data?.message || "Error fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherClasses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setTeacherClasses(response.data.data.classes || []);
      }
    } catch (error: any) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      if (!newAssignment.classId || !newAssignment.title || !newAssignment.dueDate) {
        alert("Please fill in all required fields");
        return;
      }

      const token = localStorage.getItem("authToken");
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/assignments`,
        newAssignment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setShowCreateModal(false);
        setNewAssignment({
          classId: "",
          title: "",
          description: "",
          dueDate: "",
          maxScore: 100,
        });
        fetchAssignments(); // Refresh assignments
      } else {
        alert(response.data.message || "Failed to create assignment");
      }
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      alert(error.response?.data?.message || "Error creating assignment");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading assignments...</p>
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
            onClick={fetchAssignments}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
          <p className="text-sm text-gray-500">Create and manage assignments for your classes.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800">
                {assignments.length}
              </h3>
              <p className="text-sm text-blue-600">Total Assignments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-800">
                {assignments.filter(a => getDaysUntilDue(a.dueDate) <= 7).length}
              </h3>
              <p className="text-sm text-yellow-600">Due This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800">
                {assignments.reduce((sum, a) => sum + a.submissionCount, 0)}
              </h3>
              <p className="text-sm text-green-600">Total Submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {assignments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Yet</h3>
            <p className="text-gray-500">Create your first assignment to get started.</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

            return (
              <div
                key={assignment.assignmentId}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {assignment.class.subject.subjectName} - Grade {assignment.class.subject.gradeLevel}
                    </p>
                    {assignment.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due: {formatDate(assignment.dueDate)}
                    {isOverdue && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        Overdue
                      </span>
                    )}
                    {isDueSoon && !isOverdue && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Due Soon
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {assignment.submissionCount} submissions
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Max Score: {assignment.maxScore}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    View Submissions ({assignment.submissionCount})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Create New Assignment
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  value={newAssignment.classId}
                  onChange={(e) => setNewAssignment({...newAssignment, classId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a class...</option>
                  {teacherClasses.map((cls) => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.subject.subjectName} (Grade {cls.subject.gradeLevel}) - {cls.scheduleDay} {cls.scheduleTime}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Assignment title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Assignment description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Score
                </label>
                <input
                  type="number"
                  value={newAssignment.maxScore}
                  onChange={(e) => setNewAssignment({...newAssignment, maxScore: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
