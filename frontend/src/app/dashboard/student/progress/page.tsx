"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

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

export default function StudentProgress() {
    const [results, setResults] = useState<ProgressResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/progress`,
                {
                    withCredentials: true
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

    const avgPercentage = useMemo(() => {
        if (!results.length) return "0.00";
        const avg =
            results.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / results.length;
        return avg.toFixed(2);
    }, [results]);

    if (loading) return <div className="p-6 text-center text-gray-500">Loading progress...</div>;

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
                <h2 className="text-xl font-semibold text-gray-800">Progress</h2>
                <p className="text-sm text-gray-500">Assessment results and overall performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Assessments completed</p>
                    <p className="text-2xl font-bold">{results.length}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Average percentage</p>
                    <p className="text-2xl font-bold">{avgPercentage}%</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Latest grade</p>
                    <p className="text-2xl font-bold">{results[0]?.grade || "-"}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {results.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">No progress records yet.</div>
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
