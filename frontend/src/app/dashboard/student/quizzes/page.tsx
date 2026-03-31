"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { HelpCircle } from "lucide-react";

interface Assessment {
    assessmentId: number;
    title: string;
    description: string | null;
    type: string;
    startTime: string;
    endTime: string;
    totalMarks: number;
    status: string;
    classSession?: {
        subject?: {
            subjectName: string;
            gradeLevel: string;
        };
    };
    studentResult?: {
        grade?: string;
        percentage?: string | number;
    } | null;
}

export default function StudentQuizzes() {
    const [quizzes, setQuizzes] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/assessments`,
                {
                    withCredentials: true
                }
            );

            if (response.data.code === 200) {
                setQuizzes(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch quizzes");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching quizzes");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">Loading quizzes...</div>
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
                <h2 className="text-xl font-semibold text-gray-800">Quizzes & Assessments</h2>
                <p className="text-sm text-gray-500">Your scheduled and completed assessments.</p>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
                    <HelpCircle className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    No assessments available.
                </div>
            ) : (
                <div className="bg-white border rounded-xl shadow-sm divide-y">
                    {quizzes.map((quiz) => (
                        <div key={quiz.assessmentId} className="p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-gray-800">{quiz.title}</p>
                                <p className="text-xs text-gray-500">
                                    {quiz.classSession?.subject?.subjectName || "Subject"} • {quiz.type} • {new Date(quiz.startTime).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                    {quiz.status.replace("_", " ")}
                                </span>
                                {quiz.studentResult && (
                                    <p className="text-xs text-gray-600 mt-2">
                                        Grade: {quiz.studentResult.grade || "-"} ({quiz.studentResult.percentage || 0}%)
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
