"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MessageCircle, User } from "lucide-react";

interface ClassInfo {
    classId: number;
    subject: {
        subjectId: number;
        subjectName: string;
        gradeLevel: string;
    };
    teacher: {
        teacherId: number;
        fullName: string;
    };
    scheduleDay: string;
    scheduleTime: string;
}

interface StudentClassPayload {
    studentId: number;
    fullName: string;
    grade: string;
    classes: ClassInfo[];
}

export default function StudentMessages() {
    const [studentData, setStudentData] = useState<StudentClassPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClassContacts();
    }, []);

    const fetchClassContacts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/classes`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.code === 200) {
                setStudentData(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch message contacts");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching message contacts");
        } finally {
            setLoading(false);
        }
    };

    const teacherContacts = useMemo(() => {
        const classes = studentData?.classes || [];
        const uniqueMap = new Map<number, { teacherName: string; subjects: string[] }>();

        classes.forEach((classItem) => {
            const existing = uniqueMap.get(classItem.teacher.teacherId);
            if (!existing) {
                uniqueMap.set(classItem.teacher.teacherId, {
                    teacherName: classItem.teacher.fullName,
                    subjects: [classItem.subject.subjectName],
                });
            } else if (!existing.subjects.includes(classItem.subject.subjectName)) {
                existing.subjects.push(classItem.subject.subjectName);
            }
        });

        return Array.from(uniqueMap.values());
    }, [studentData]);

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">Loading contacts...</div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                <p className="text-sm text-gray-500">
                    Teacher contacts for your current classes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Teachers</p>
                    <p className="text-2xl font-bold">{teacherContacts.length}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Active classes</p>
                    <p className="text-2xl font-bold">{studentData?.classes?.length || 0}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Mailbox</p>
                    <p className="text-2xl font-bold">Coming soon</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {teacherContacts.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        <MessageCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                        No teacher contacts found yet. Enroll in classes to see message contacts.
                    </div>
                ) : (
                    teacherContacts.map((contact) => (
                        <div key={contact.teacherName} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-800">{contact.teacherName}</p>
                                <p className="text-xs text-gray-500">
                                    Subjects: {contact.subjects.join(", ")}
                                </p>
                            </div>
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
