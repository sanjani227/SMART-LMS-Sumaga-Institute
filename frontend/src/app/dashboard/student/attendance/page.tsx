"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface AttendanceRecord {
    attendanceId: number;
    attendanceDate: string;
    status: "present" | "absent" | "late" | "excused";
    remarks: string | null;
    classSession?: {
        classId: number;
        subject?: {
            subjectName: string;
            gradeLevel: string;
        };
    };
}

export default function StudentAttendance() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/attendance`,
                {
                    withCredentials: true
                }
            );

            if (response.data.code === 200) {
                setRecords(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch attendance");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching attendance");
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const present = records.filter((row) => row.status === "present").length;
        const late = records.filter((row) => row.status === "late").length;
        const absences = records.filter((row) => row.status === "absent").length;
        return { present, late, absences };
    }, [records]);

    if (loading) return <div className="p-6 text-center text-gray-500">Loading attendance...</div>;

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
                <p className="text-sm text-gray-500">Your latest attendance records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-2xl font-bold">{stats.present}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Late arrivals</p>
                    <p className="text-2xl font-bold">{stats.late}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Absences</p>
                    <p className="text-2xl font-bold">{stats.absences}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-50 text-xs font-semibold text-gray-600 px-4 py-2 uppercase tracking-wide">
                    <span>Date</span>
                    <span>Subject</span>
                    <span>Status</span>
                    <span>Remark</span>
                </div>
                {records.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">No attendance records found.</div>
                ) : (
                    records.map((row) => (
                        <div key={row.attendanceId} className="grid grid-cols-4 px-4 py-3 text-sm border-t gap-2">
                            <span className="text-gray-800">{new Date(row.attendanceDate).toLocaleDateString()}</span>
                            <span className="text-gray-700">{row.classSession?.subject?.subjectName || "-"}</span>
                            <span
                                className={`font-medium ${
                                    row.status === "present"
                                        ? "text-green-600"
                                        : row.status === "late"
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                }`}
                            >
                                {row.status}
                            </span>
                            <span className="text-gray-500">{row.remarks || "-"}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
