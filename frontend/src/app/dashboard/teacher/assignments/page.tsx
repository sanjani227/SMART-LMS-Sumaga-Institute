"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardList, Plus, X, Calendar, FileText, Users } from "lucide-react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const token = localStorage.getItem("TOKEN");
      const res = await axios.get("http://localhost:3000/api/v1/teachers/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        setAssignments(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching assignments", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.get("http://localhost:3000/api/v1/teachers/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data?.classes) {
        setClasses(res.data.data.classes);
        if (res.data.data.classes.length > 0) {
          setClassId(res.data.data.classes[0].classId.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching classes", error);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !title || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.post(
        "http://localhost:3000/api/v1/teachers/assignments",
        {
          classId: parseInt(classId),
          title,
          description,
          dueDate,
          maxScore: parseFloat(maxScore),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.code === 200) {
        toast.success("Assignment created successfully");
        setIsModalOpen(false);
        // Reset form
        setTitle("");
        setDescription("");
        setDueDate("");
        setMaxScore("100");
        fetchAssignments(); // Refresh list
      } else {
        toast.error(res.data.message || "Failed to create assignment");
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
      ) : assignments.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center text-gray-500">
          <ClipboardList className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg">No assignments created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.assignmentId}
              className="bg-white rounded-2xl border hover:shadow-md transition p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 truncate" title={assignment.title}>
                  {assignment.title}
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                  {assignment.maxScore} pts
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                {assignment.description || "No description provided."}
              </div>

              <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="truncate">Class: {assignment.class?.subject?.subjectName} - {assignment.class?.scheduleDay}</span>
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
                    <span>{assignment.submissionCount} Submissions</span>
                  </div>
                  <Link 
                    href={`/dashboard/teacher/assignments/${assignment.assignmentId}/submissions`}
                    className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg transition"
                  >
                    View & Grade
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
                      Class {cls.classId}: {cls.subject?.subjectName} ({cls.scheduleDay} {cls.scheduleTime})
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
