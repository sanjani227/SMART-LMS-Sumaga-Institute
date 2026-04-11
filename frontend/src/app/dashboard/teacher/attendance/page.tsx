"use client";
import { useState, useEffect } from "react";
import { Calendar, Users, CheckSquare, X, Save, Clock } from "lucide-react";
import axios from "axios";

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

interface Student {
  studentId: number;
  fullName: string;
  grade: string;
  user: {
    email: string;
  };
  attendance: {
    attendanceId: number;
    status: string;
    remarks: string;
  } | null;
}

interface ClassAttendanceData {
  classInfo: Class;
  date: string;
  students: Student[];
}

export default function TeacherAttendance() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState<ClassAttendanceData | null>(null);
  const [attendanceChanges, setAttendanceChanges] = useState<Record<number, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchTeacherClasses = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      
      const response = await axios.get(
        `http://localhost:3000/api/v1/teachers/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setClasses(response.data.data.classes || []);
      }
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      setError("Failed to fetch classes");
    }
  };

  const fetchStudentsForAttendance = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("TOKEN");
      
      const response = await axios.get(
        `http://localhost:3000/api/v1/teachers/classes/${selectedClass.classId}/students?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        setAttendanceData(response.data.data);
        setAttendanceChanges({});
      } else {
        setError(response.data.message || "Failed to fetch students");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      setError(error.response?.data?.message || "Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async () => {
    if (!selectedClass || !attendanceData) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("TOKEN");

      const attendanceArray = attendanceData.students.map(student => {
        const change = attendanceChanges[student.studentId];
        const currentAttendance = student.attendance;
        
        return {
          studentId: student.studentId,
          status: change?.status || currentAttendance?.status || 'absent',
          remarks: change?.remarks || currentAttendance?.remarks || '',
        };
      });

      const response = await axios.post(
        `http://localhost:3000/api/v1/teachers/attendance`,
        {
          classId: selectedClass.classId,
          date: selectedDate,
          attendanceData: attendanceArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        alert("Attendance saved successfully!");
        setAttendanceChanges({});
        fetchStudentsForAttendance();
      } else {
        alert(response.data.message || "Failed to save attendance");
      }
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      alert(error.response?.data?.message || "Error saving attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
        <p className="text-sm text-gray-500">
          Take attendance for your classes and track student participation.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass?.classId || ""}
              onChange={(e) => {
                const classId = parseInt(e.target.value);
                const cls = classes.find(c => c.classId === classId);
                setSelectedClass(cls || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a class...</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.subject.subjectName} - Grade {cls.subject.gradeLevel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <Clock className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading students...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {!selectedClass && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
          <p className="text-gray-500">Choose a class and date to take attendance.</p>
        </div>
      )}

      {selectedClass && attendanceData && !loading && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedClass.subject.subjectName} - Grade {selectedClass.subject.gradeLevel}
                </h3>
                <p className="text-sm text-gray-500">
                  {attendanceData.date} | {attendanceData.students.length} students
                </p>
              </div>
              <button
                onClick={saveAttendance}
                disabled={saving || Object.keys(attendanceChanges).length === 0}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Student
                  </th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Present
                  </th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Absent
                  </th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Late
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.students.map((student) => {
                  const currentStatus = attendanceChanges[student.studentId]?.status || 
                                      student.attendance?.status || 
                                      'absent';
                  const currentRemarks = attendanceChanges[student.studentId]?.remarks || 
                                       student.attendance?.remarks || 
                                       '';

                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Grade {student.grade} | {student.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="radio"
                          name={`attendance-${student.studentId}`}
                          checked={currentStatus === 'present'}
                          onChange={() => {
                            setAttendanceChanges(prev => ({
                              ...prev,
                              [student.studentId]: {
                                ...prev[student.studentId],
                                status: 'present'
                              }
                            }));
                          }}
                          className="w-4 h-4 text-green-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="radio"
                          name={`attendance-${student.studentId}`}
                          checked={currentStatus === 'absent'}
                          onChange={() => {
                            setAttendanceChanges(prev => ({
                              ...prev,
                              [student.studentId]: {
                                ...prev[student.studentId],
                                status: 'absent'
                              }
                            }));
                          }}
                          className="w-4 h-4 text-red-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="radio"
                          name={`attendance-${student.studentId}`}
                          checked={currentStatus === 'late'}
                          onChange={() => {
                            setAttendanceChanges(prev => ({
                              ...prev,
                              [student.studentId]: {
                                ...prev[student.studentId],
                                status: 'late'
                              }
                            }));
                          }}
                          className="w-4 h-4 text-yellow-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={currentRemarks}
                          onChange={(e) => {
                            setAttendanceChanges(prev => ({
                              ...prev,
                              [student.studentId]: {
                                ...prev[student.studentId],
                                status: currentStatus,
                                remarks: e.target.value
                              }
                            }));
                          }}
                          placeholder="Add remarks..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
