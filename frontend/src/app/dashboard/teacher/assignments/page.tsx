"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, Clock, Edit, Eye, GraduationCap, Plus, Users, X } from "lucide-react";
import Link from "next/link";

interface Assignment {
  assignmentId: number;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionCount: number;
  class: {
    classId: number;
    subject?: {
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
  subject?: {
    subjectId: number;
    subjectName: string;
    gradeLevel: string;
  };
  scheduleDay: string;
  scheduleTime: string;
}

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchClasses();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/assignments`,
        {
          withCredentials: true
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

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/classes`,
        {
          withCredentials: true
        }
      );

      if (response.data.code === 200) {
        setClasses(response.data.data.classes || []);
      }
    } catch (error: any) {
      console.error("Error fetching classes:", error);
    }
  };

  const getDaysUntilDue = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !title || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const newAssignment = {
        classId: parseInt(classId),
        title,
        description,
        dueDate,
        maxScore: parseInt(maxScore) || 100
      };
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/assignments`,
        newAssignment,
        {
          withCredentials: true
        }
      );

      if (response.data.code === 200) {
        toast.success("Assignment created successfully");
        setIsModalOpen(false);
        // Reset form
        setTitle("");
        setDescription("");
        setDueDate("");
        setMaxScore("100");
        setClassId("");
        fetchAssignments(); // Refresh list
      } else {
        toast.error(response.data.message || "Failed to create assignment");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <p className="text-sm text-gray-500">Manage your course assignments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Plus size={20} />
          Create Assignment
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {assignments.reduce((sum, a) => sum + (a.submissionCount || 0), 0)}
                  </h3>
                  <p className="text-sm text-green-600">Total Submissions</p>
                </div>
              </div>
            </div>
          </div>

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
                            {assignment.class?.subject?.subjectName || "Subject not assigned"}
                            {assignment.class?.subject?.gradeLevel
                              ? ` - Grade ${assignment.class.subject.gradeLevel}`
                              : ""}
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
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className={new Date(assignment.dueDate) < new Date() ? "text-red-500 font-medium" : ""}>
                        Due: {new Date(assignment.dueDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-orange-600 font-medium pt-2 w-full">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{assignment.submissionCount || 0} Submissions</span>
                      </div>
                      <Link 
                        href={`/dashboard/teacher/assignments/${assignment.assignmentId}/submissions`}
                        className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg transition"
                      >
                        View & Grade
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-max max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <h2 className="text-xl font-bold text-gray-800">Create New Assignment</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700"
                  required
                >
                  {classes.length === 0 && <option value="">No classes available</option>}
                  {classes.map((cls) => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.subject?.subjectName || "Subject not assigned"}
                      {cls.subject?.gradeLevel ? ` (Grade ${cls.subject.gradeLevel})` : ""}
                      {` - ${cls.scheduleDay} ${cls.scheduleTime}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Essay"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide instructions for the assignment..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || classes.length === 0}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
