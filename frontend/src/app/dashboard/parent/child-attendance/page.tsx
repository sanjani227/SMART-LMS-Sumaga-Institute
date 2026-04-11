"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Child {
    studentId: number;
    fullName: string;
    grade: string | null;
}

interface AttendanceRecord {
    attendanceId: number;
    attendanceDate: string;
    status: "present" | "absent" | "late" | "excused";
    remarks: string | null;
    classSession?: {
        subject?: {
            subjectName: string;
            gradeLevel: string;
        };
    };
}

export default function ChildAttendancePage() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get("studentId");

    const [children, setChildren] = useState<Child[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [days, setDays] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initializePage();
    }, [studentId]);

    const initializePage = async () => {
        try {
            setLoading(true);
            setError(null);

            const childrenResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/children`,
                {
                    withCredentials: true,
                }
            );

            if (childrenResponse.data.code !== 200) {
                setError(childrenResponse.data.message || "Failed to load linked children");
                setLoading(false);
                return;
            }

            const linkedChildren: Child[] = childrenResponse.data.data || [];
            setChildren(linkedChildren);

            if (!linkedChildren.length) {
                setError("No linked children found. Please link a child first in Parent Settings.");
                setLoading(false);
                return;
            }

            const requestedId = studentId ? parseInt(studentId) : null;
            const hasRequested = requestedId
                ? linkedChildren.some((child) => child.studentId === requestedId)
                : false;

            const targetId = hasRequested
                ? requestedId!
                : linkedChildren[0].studentId;

            setSelectedStudentId(String(targetId));
            await fetchAttendance(String(targetId));
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Error loading child data");
        }
    };

    const fetchAttendance = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/children/${id}/attendance`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.code === 200) {
                setDays(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch attendance");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching attendance");
        } finally {
            setLoading(false);
        }
    };

    const handleChildChange = async (id: string) => {
        setSelectedStudentId(id);
        await fetchAttendance(id);
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading attendance...</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
            </div>
        );
    }

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

            <div className="bg-white border rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Child</label>
                <select
                    value={selectedStudentId}
                    onChange={(e) => handleChildChange(e.target.value)}
                    className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md"
                >
                    {children.map((child) => (
                        <option key={child.studentId} value={child.studentId}>
                            {child.fullName} (Grade {child.grade || "N/A"})
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-50 text-xs font-semibold text-gray-600 px-4 py-2 uppercase tracking-wide">
                    <span>Date</span>
                    <span>Subject</span>
                    <span>Status</span>
                    <span>Remarks</span>
                </div>
                {days.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">No attendance records found.</div>
                ) : (
                    days.map((day) => (
                        <div key={day.attendanceId} className="grid grid-cols-4 px-4 py-3 text-sm border-t gap-2">
                            <span className="text-gray-800">{new Date(day.attendanceDate).toLocaleDateString()}</span>
                            <span className="text-gray-700">{day.classSession?.subject?.subjectName || "-"}</span>
                            <span
                                className={`font-medium ${
                                    day.status === "present"
                                        ? "text-green-600"
                                        : day.status === "late"
                                            ? "text-yellow-600"
                                            : "text-orange-600"
                                }`}
                            >
                                {day.status}
                            </span>
                            <span className="text-gray-500">{day.remarks || "-"}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}