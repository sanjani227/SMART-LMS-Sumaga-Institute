"use client";
import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Calendar, CheckCircle2, Clock3 } from "lucide-react";
import axios from "axios";

interface Assignment {
    assignmentId: number;
    title: string;
    description: string | null;
    dueDate: string;
    maxScore: string | number;
    submissionStatus: string;
    class: {
        classId: number;
        subject?: {
            subjectName: string;
            gradeLevel: string;
        };
    };
    submission: {
        score: string | number | null;
        status: string;
        submittedAt: string | null;
    } | null;
}

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/assignments`,
                {
                    withCredentials: true
                }
            );

            if (response.data.code === 200) {
                setAssignments(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch assignments");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching assignments");
        } finally {
            setLoading(false);
        }
    };

    const summary = useMemo(() => {
        const pending = assignments.filter(
            (item) => item.submissionStatus === "not_submitted"
        ).length;
        const submitted = assignments.filter(
            (item) => item.submissionStatus === "submitted" || item.submissionStatus === "graded"
        ).length;
        const graded = assignments.filter((item) => item.submissionStatus === "graded");

        const avg = graded.length
            ? (
                    graded.reduce((total, item) => total + Number(item.submission?.score || 0), 0) /
                    graded.length
                ).toFixed(1)
            : "0.0";

        return { pending, submitted, avg };
    }, [assignments]);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-64">
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
                    <p className="text-red-700">Error: {error}</p>
                    <button
                        onClick={fetchAssignments}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Assignments</h2>
                <p className="text-sm text-gray-500">Track due dates, submissions, and grades.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">{summary.pending}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-2xl font-bold">{summary.submitted}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Average score</p>
                    <p className="text-2xl font-bold">{summary.avg}</p>
                </div>
            </div>

            {assignments.length === 0 ? (
                <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
                    <ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    No assignments available yet.
                </div>
            ) : (
                <div className="bg-white border rounded-xl shadow-sm divide-y">
                    {assignments.map((item) => (
                        <div key={item.assignmentId} className="p-4 flex justify-between items-start gap-4">
                            <div>
                                <p className="font-semibold text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {item.class?.subject?.subjectName || "Subject"} • Due {new Date(item.dueDate).toLocaleString()}
                                </p>
                                {item.description && (
                                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                )}
                            </div>

                            <div className="text-right">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        item.submissionStatus === "graded"
                                            ? "bg-green-100 text-green-700"
                                            : item.submissionStatus === "submitted"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-orange-100 text-orange-700"
                                    }`}
                                >
                                    {item.submissionStatus.replace("_", " ")}
                                </span>

                                <div className="text-xs text-gray-500 mt-2 flex items-center justify-end gap-1">
                                    {item.submissionStatus === "graded" ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    ) : item.submissionStatus === "submitted" ? (
                                        <Clock3 className="w-3.5 h-3.5" />
                                    ) : (
                                        <Calendar className="w-3.5 h-3.5" />
                                    )}
                                    {item.submission?.score ? `Score: ${item.submission.score}` : `Max: ${item.maxScore}`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
