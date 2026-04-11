"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { User, Calendar, CheckCircle2, XCircle, Clock, Loader2, CalendarDays } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChildAttendancePage() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingAttendance, setFetchingAttendance] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchAttendance(selectedChild);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/children`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200 && response.data.data) {
        setChildren(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedChild(response.data.data[0].studentId.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load your enrolled children.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (studentId: string) => {
    try {
      setFetchingAttendance(true);
      const token = localStorage.getItem("TOKEN");
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/children/${studentId}/attendance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200) {
        setAttendanceData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance records.");
    } finally {
      setFetchingAttendance(false);
    }
  };

  const getStatusBadge = (status: string, remarks: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return { 
          icon: <CheckCircle2 className="text-green-600" size={20} />, 
          bg: "bg-green-50 border-green-200 text-green-700",
          text: "Present" 
        };
      case "absent":
        return { 
          icon: <XCircle className="text-red-600" size={20} />, 
          bg: "bg-red-50 border-red-200 text-red-700",
          text: remarks ? `Absent (${remarks})` : "Absent"
        };
      case "late":
        return { 
          icon: <Clock className="text-orange-600" size={20} />, 
          bg: "bg-orange-50 border-orange-200 text-orange-700",
          text: remarks ? `Late (${remarks})` : "Late"
        };
      default:
        return { 
          icon: <CheckCircle2 className="text-gray-400" size={20} />, 
          bg: "bg-gray-50 border-gray-200 text-gray-700",
          text: status
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white p-10 rounded-2xl border text-center">
          <User className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Children Found</h3>
          <p className="text-gray-500">
            We could not find any students linked to your account. Please contact the administration or ensure your profile is fully synced.
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(a => a.status.toLowerCase() === 'present').length;
  const lateDays = attendanceData.filter(a => a.status.toLowerCase() === 'late').length;
  const absentDays = attendanceData.filter(a => a.status.toLowerCase() === 'absent').length;
  const attendancePercentage = totalDays > 0 ? Math.round(((presentDays + (lateDays * 0.5)) / totalDays) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Child Attendance</h1>
          <p className="text-sm text-gray-500">Monitor your child's daily class attendance</p>
        </div>

        <div className="w-full md:w-auto min-w-[250px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Child
          </label>
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white"
          >
            {children.map((child) => (
              <option key={child.studentId} value={child.studentId}>
                {child.fullName} - Grade {child.grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fetchingAttendance ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : attendanceData.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center">
          <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Yet</h3>
          <p className="text-gray-500">
            There are no attendance records available for this student yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border shadow-sm text-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Overall Rate</p>
              <p className={`text-2xl font-bold ${attendancePercentage >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                {attendancePercentage}%
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm text-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Present</p>
              <p className="text-2xl font-bold text-gray-800">{presentDays}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm text-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Late</p>
              <p className="text-2xl font-bold text-gray-800">{lateDays}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm text-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Absent</p>
              <p className="text-2xl font-bold text-gray-800">{absentDays}</p>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2 text-gray-700 font-semibold">
              <CalendarDays size={18} />
              Attendance History
            </div>
            <div className="divide-y">
              {attendanceData.map((record) => {
                const badge = getStatusBadge(record.status, record.remarks);
                return (
                  <div key={record.attendanceId} className="p-4 hover:bg-gray-50 transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex flex-col items-center justify-center border shrink-0">
                        <span className="text-xs text-gray-500 font-semibold uppercase leading-none mb-1">
                          {new Date(record.attendanceDate).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-gray-800 leading-none">
                          {new Date(record.attendanceDate).getDate()}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {record.classSession?.subject?.subjectName || "Class Session"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(record.attendanceDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-sm ${badge.bg}`}>
                      {badge.icon}
                      <span className="hidden sm:inline">{badge.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}