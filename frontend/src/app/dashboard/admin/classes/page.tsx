"use client";

import axios from "axios";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ManageClassesPage() {
  const [allClasses, setClasses] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [activeClasses, setActiveClasses] = useState(0)

  // Add Class Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [newClassDetails, setNewClassDetails] = useState({
    teacherId: "",
    scheduleDay: "Monday",
    scheduleTime: "08:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Edit Class Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClassDetails, setEditClassDetails] = useState({
    classId: "",
    teacherId: "",
    scheduleDay: "Monday",
    scheduleTime: "08:00",
    isDeleted: false
  });

  const getAllClasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/classes/getClasses",
        {
          withCredentials: true
        }
      );

      setClasses(response.data.data.map((e:any) => e));

       setActiveClasses(response.data.data.filter((e:any) => e.isDeleted == false).length)
       console.log("_______________", allClasses)
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/allUsers",
      );
      setAllUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getTeachers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/teachers/getAllTeacher",
        { withCredentials: true }
      );
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    getAllClasses();
    getAllUsers();
    getTeachers();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassDetails.teacherId || !newClassDetails.scheduleDay || !newClassDetails.scheduleTime) {
      setSubmitError("Please fill out all fields.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/classes/createClass",
        newClassDetails,
        { withCredentials: true }
      );
      
      if (res.data.code === 200) {
        setShowAddModal(false);
        setNewClassDetails({ teacherId: "", scheduleDay: "Monday", scheduleTime: "08:00" });
        getAllClasses(); // refresh list
      } else {
        setSubmitError(res.data.message || "Failed to create class.");
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClassClick = (cls: any) => {
    setEditClassDetails({
      classId: cls.classId,
      teacherId: cls.teacherId,
      scheduleDay: cls.scheduleDay,
      scheduleTime: cls.scheduleTime,
      isDeleted: cls.isDeleted
    });
    setSubmitError("");
    setShowEditModal(true);
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        teacherId: editClassDetails.teacherId,
        scheduleDay: editClassDetails.scheduleDay,
        scheduleTime: editClassDetails.scheduleTime,
        isDeleted: editClassDetails.isDeleted
      };

      const res = await axios.put(
        `http://localhost:3000/api/v1/classes/updateClass/${editClassDetails.classId}`,
        payload,
        { withCredentials: true }
      );

      if (res.data.code === 200) {
        setShowEditModal(false);
        getAllClasses();
      } else {
        setSubmitError(res.data.message || "Failed to edit class.");
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (classId: number) => {
    if (confirm("Are you sure you want to deactivate/delete this class?")) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/classes/deleteClass/${classId}`, {
          withCredentials: true
        });
        getAllClasses();
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  const stats = [
    {
      label: "Total Classes",
      value: allClasses.length,
      icon: <BookOpen size={24} />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Active Classes",
      value: activeClasses,
      icon: <CheckCircle size={24} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Total Students",
      value: allUsers.length,
      icon: <Users size={24} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center px-2 py-2">
        <h2 className="text-2xl font-bold text-gray-800">Manage Classes</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition"
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div
              className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search classes"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
          />
        </div>
        <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-orange-200">
          <option>All Grades</option>
          {[7, 8, 9, 10, 11, 12, 13].map((g) => (
            <option key={g}>Grade {g}</option>
          ))}
        </select>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Class Name</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allClasses.map((cls, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-orange-600" size={18} />
                      </div>
                      <span className="font-semibold text-gray-800">
                        {cls.subject?.subjectName || 'Unknown Subject'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{cls.subject?.gradeLevel || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{cls.teacher?.fullName || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                      {cls.students || 0} Students
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {cls.scheduleDay} <span className="opacity-50">| {cls.scheduleTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cls.isDeleted === false
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-red-400"
                      }`}
                    >
                      {cls.isDeleted ? "Deactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleEditClassClick(cls)}
                        className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClass(cls.classId)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {allClasses.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 font-medium">
                    No classes available. Add a new class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {allClasses.length > 0 ? '1' : '0'} to {allClasses.length} of {allClasses.length} classes</p>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <ChevronLeft size={18} />
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold">
              1
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
            <button 
              onClick={() => setShowAddModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Class</h3>
            
            <form onSubmit={handleCreateClass} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {submitError}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Assign Teacher</label>
                <select 
                  value={newClassDetails.teacherId}
                  onChange={(e) => setNewClassDetails({...newClassDetails, teacherId: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  required
                >
                  <option value="" disabled>Select a teacher...</option>
                  {teachers?.map((t: any) => (
                    <option key={t.teacherId} value={t.teacherId}>
                      {t.fullName} ({t.specialization || "No Specific Subject"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Schedule Day</label>
                <select 
                  value={newClassDetails.scheduleDay}
                  onChange={(e) => setNewClassDetails({...newClassDetails, scheduleDay: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  required
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Schedule Time</label>
                <input 
                  type="time" 
                  value={newClassDetails.scheduleTime}
                  onChange={(e) => setNewClassDetails({...newClassDetails, scheduleTime: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition mt-4 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <><BookOpen size={18} className="animate-spin" /> Creating...</> : "Create Class"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
            <button 
              onClick={() => setShowEditModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Edit Class</h3>
            
            <form onSubmit={handleUpdateClass} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {submitError}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Assign Teacher</label>
                <select 
                  value={editClassDetails.teacherId}
                  onChange={(e) => setEditClassDetails({...editClassDetails, teacherId: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  required
                >
                  <option value="" disabled>Select a teacher...</option>
                  {teachers?.map((t: any) => (
                    <option key={t.teacherId} value={t.teacherId}>
                      {t.fullName} ({t.specialization || "No Specific Subject"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Schedule Day</label>
                <select 
                  value={editClassDetails.scheduleDay}
                  onChange={(e) => setEditClassDetails({...editClassDetails, scheduleDay: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  required
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Schedule Time</label>
                <input 
                  type="time" 
                  value={editClassDetails.scheduleTime}
                  onChange={(e) => setEditClassDetails({...editClassDetails, scheduleTime: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div className="space-y-2 flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="classStatus"
                  checked={!editClassDetails.isDeleted}
                  onChange={(e) => setEditClassDetails({...editClassDetails, isDeleted: !e.target.checked})}
                  className="w-5 h-5 accent-orange-600 rounded"
                />
                <label htmlFor="classStatus" className="text-sm font-bold text-gray-700 cursor-pointer">
                  Class is active and visible
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition mt-4 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <><BookOpen size={18} className="animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
