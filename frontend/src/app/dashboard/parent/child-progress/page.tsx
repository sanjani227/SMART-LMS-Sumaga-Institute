"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Child {
    studentId: number;
    fullName: string;
    grade: string | null;
}

interface ProgressResult {
    resultId: number;
    totalScore: number;
    percentage: string | number | null;
    grade: string | null;
    status: string;
    completedAt: string | null;
    assessment: {
        title: string;
        classSession?: {
            subject?: {
                subjectName: string;
            };
        };
    };
}

export default function ChildProgress() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get("studentId");

    const [children, setChildren] = useState<Child[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [results, setResults] = useState<ProgressResult[]>([]);
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
            await fetchProgress(String(targetId));
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Error loading child data");
        }
    };

    const fetchProgress = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/children/${id}/progress`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.code === 200) {
                setResults(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch progress");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching progress");
        } finally {
            setLoading(false);
        }
    };

    const handleChildChange = async (id: string) => {
        setSelectedStudentId(id);
        await fetchProgress(id);
    };

    const avgPercentage = useMemo(() => {
        if (!results.length) return "0.00";
        const avg =
            results.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / results.length;
        return avg.toFixed(2);
    }, [results]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading progress...</div>;
    }

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
                <h2 className="text-xl font-semibold text-gray-800">Progress Overview</h2>
                <p className="text-sm text-gray-500">Latest assessment outcomes for your child.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Assessments</p>
                    <p className="text-2xl font-bold">{results.length}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Average %</p>
                    <p className="text-2xl font-bold">{avgPercentage}%</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Latest grade</p>
                    <p className="text-2xl font-bold">{results[0]?.grade || "-"}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {results.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">No progress records found.</div>
                ) : (
                    results.map((result) => (
                        <div key={result.resultId} className="p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-gray-800">{result.assessment?.title || "Assessment"}</p>
                                <p className="text-xs text-gray-500">
                                    {result.assessment?.classSession?.subject?.subjectName || "Subject"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">{result.grade || "-"}</p>
                                <p className="text-xs text-gray-500">{result.percentage || 0}%</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}