"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Calendar, Clock, Plus, Users, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [scheduleDay, setScheduleDay] = useState("Monday");
  const [scheduleTime, setScheduleTime] = useState("");
  const [grade, setGrade] = useState("6");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.get("http://localhost:3000/api/v1/teachers/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        setCourses(res.data.data.classes || []);
        setTeacherId(res.data.data.teacherId);
      }
    } catch (error) {
      console.error("Error fetching courses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !scheduleDay || !scheduleTime || !grade) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.post(
        "http://localhost:3000/api/v1/classes/createClass",
        {
          teacherId,
          grade,
          scheduleDay,
          scheduleTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.code === 200) {
        toast.success("Course scheduled successfully");
        setIsModalOpen(false);
        setScheduleTime("");
        fetchCourses(); // Refresh list
      } else {
        toast.error(res.data.message || "Failed to create course");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error scheduling course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-sm text-gray-500">Manage your classes and schedule</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Plus size={20} />
          Schedule Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center text-gray-500">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg">You haven't been assigned to any classes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.classId}
              className="bg-white rounded-2xl border hover:shadow-md transition overflow-hidden p-0"
            >
              <div className="h-2 bg-orange-400"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {course.subject?.subjectName || "Subject"}
                  </h3>
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                    {course.subject?.gradeLevel || "Grade"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{course.scheduleDay}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{course.scheduleTime}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t mt-3">
                    <Users size={16} className="text-gray-400" />
                    <span>Class ID: {course.classId}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Schedule New Course</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700 mb-4"
                  required
                >
                  {[6, 7, 8, 9, 10, 11].map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day of the Week
                </label>
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700"
                  required
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700"
                  required
                />
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
                  disabled={submitting || !teacherId}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {submitting ? "Scheduling..." : "Schedule Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
