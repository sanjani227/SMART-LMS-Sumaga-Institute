"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Child {
    studentId: number;
    fullName: string;
    grade: string | null;
}

interface Payment {
    paymentId: number;
    amount: string | number;
    paymentType: string;
    paymentMethod: string;
    status: "pending" | "completed" | "failed" | "refunded";
    dueDate: string | null;
    paidDate: string | null;
}

export default function ChildPayments() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get("studentId");

    const [children, setChildren] = useState<Child[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [invoices, setInvoices] = useState<Payment[]>([]);
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
            await fetchPayments(String(targetId));
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Error loading child data");
        }
    };

    const fetchPayments = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/parents/children/${id}/payments`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.code === 200) {
                setInvoices(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch payments");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching payments");
        } finally {
            setLoading(false);
        }
    };

    const handleChildChange = async (id: string) => {
        setSelectedStudentId(id);
        await fetchPayments(id);
    };

    const stats = useMemo(() => {
        const totalDue = invoices
            .filter((inv) => inv.status === "pending")
            .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
        const totalPaid = invoices
            .filter((inv) => inv.status === "completed")
            .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
        return { totalDue, totalPaid };
    }, [invoices]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading payments...</div>;
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
                <h2 className="text-xl font-semibold text-gray-800">Payments</h2>
                <p className="text-sm text-gray-500">Your child's school invoices.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total due</p>
                    <p className="text-2xl font-bold">${stats.totalDue.toFixed(2)}</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total paid</p>
                    <p className="text-2xl font-bold">${stats.totalPaid.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {invoices.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">No payment records found.</div>
                ) : (
                    invoices.map((inv) => (
                        <div key={inv.paymentId} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-800">{inv.paymentType.replace("_", " ")}</p>
                                <p className="text-xs text-gray-500">Amount: ${Number(inv.amount).toFixed(2)}</p>
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