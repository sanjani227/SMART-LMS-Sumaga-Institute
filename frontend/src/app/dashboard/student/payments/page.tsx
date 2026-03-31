"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Payment {
    paymentId: number;
    amount: string | number;
    paymentType: string;
    paymentMethod: string;
    status: "pending" | "completed" | "failed" | "refunded";
    dueDate: string | null;
    paidDate: string | null;
    description: string | null;
}

interface EnrolledClass {
    classId: number;
    subjectName: string | null;
    gradeLevel: string | null;
    scheduleDay: string;
    scheduleTime: string;
}

export default function StudentPayments() {
    const [invoices, setInvoices] = useState<Payment[]>([]);
    const [classRelatedInvoices, setClassRelatedInvoices] = useState<Payment[]>([]);
    const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/payments`,
                {
                    withCredentials: true
                }
            );

            if (response.data.code === 200) {
                const payload = response.data.data;

                if (Array.isArray(payload)) {
                    setInvoices(payload);
                    setClassRelatedInvoices(payload);
                    setEnrolledClasses([]);
                } else {
                    setInvoices(payload?.payments || []);
                    setClassRelatedInvoices(payload?.classRelatedPayments || []);
                    setEnrolledClasses(payload?.enrolledClasses || []);
                }
            } else {
                setError(response.data.message || "Failed to fetch payments");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching payments");
        } finally {
            setLoading(false);
        }
    };

    const summary = useMemo(() => {
        const totalDue = invoices
            .filter((inv) => inv.status === "pending")
            .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

        const totalPaid = invoices
            .filter((inv) => inv.status === "completed")
            .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

        const pendingCount = invoices.filter((inv) => inv.status === "pending").length;

        return { totalDue, totalPaid, pendingCount };
    }, [invoices]);

    if (loading) return <div className="p-6 text-center text-gray-500">Loading payments...</div>;

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
                <h2 className="text-xl font-semibold text-gray-800">Payments</h2>
                <p className="text-sm text-gray-500">Class-related fees and payment status for enrolled classes.</p>
            </div>

            <div className="bg-white border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Enrolled Classes</h3>
                {enrolledClasses.length === 0 ? (
                    <p className="text-sm text-gray-500">No enrolled classes yet. Join classes in Courses to see class-related fees.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {enrolledClasses.map((classInfo) => (
                            <span
                                key={classInfo.classId}
                                className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                            >
                                {classInfo.subjectName || "Subject"} {classInfo.gradeLevel ? `(Grade ${classInfo.gradeLevel})` : ""}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total due</p>
                    <p className="text-2xl font-bold">${summary.totalDue.toFixed(2)}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total paid</p>
                    <p className="text-2xl font-bold">${summary.totalPaid.toFixed(2)}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Class-related fees</p>
                    <p className="text-2xl font-bold">{classRelatedInvoices.length}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Pending invoices</p>
                    <p className="text-2xl font-bold">{summary.pendingCount}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {classRelatedInvoices.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">No class-related payment records found.</div>
                ) : (
                    classRelatedInvoices.map((inv) => (
                        <div key={inv.paymentId} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-800">{inv.paymentType.replace("_", " ")}</p>
                                <p className="text-xs text-gray-500">
                                    Amount: ${Number(inv.amount).toFixed(2)} • Method: {inv.paymentMethod.replace("_", " ")}
                                </p>
                                {inv.description && (
                                    <p className="text-xs text-gray-400 mt-1">{inv.description}</p>
                                )}
                            </div>
                            <span
                                className={`text-sm font-medium ${
                                    inv.status === "completed"
                                        ? "text-green-600"
                                        : inv.status === "pending"
                                            ? "text-orange-600"
                                            : "text-red-600"
                                }`}
                            >
                                {inv.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
