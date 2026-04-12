"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Wallet, CheckCircle2, Loader2 } from "lucide-react";

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
                // Not throwing error to allow rendering children length check
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

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
            </div>
        );
    }

    if (!loading && children.length === 0) {
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

    return (
      <div className="p-6 space-y-6">
        <ToastContainer position="top-right" autoClose={3000} />
  
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payments & Fees</h1>
            <p className="text-sm text-gray-500">Review your child's payment history and pending dues</p>
          </div>
  
          <div className="w-full md:w-auto min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Child
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleChildChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white"
            >
              {children.map((child) => (
                <option key={child.studentId} value={child.studentId}>
                  {child.fullName} - Grade {child.grade || "N/A"}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border text-center">
            <Wallet className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Invoices Yet</h3>
            <p className="text-gray-500">
              There are no payment records or pending invoices for this student.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-gray-800">
                    Rs. {stats.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 size={24} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Due</p>
                  <p className="text-3xl font-bold text-gray-800">
                    Rs. {stats.totalDue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Wallet size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {invoices.map((inv) => (
                    <div key={inv.paymentId} className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800 capitalize">{inv.paymentType.replace("_", " ")}</p>
                            <p className="text-xs text-gray-500">Amount: Rs. {Number(inv.amount).toFixed(2)}</p>
                        </div>
                        <span
                            className={`text-sm font-medium px-3 py-1 rounded-full ${
                                inv.status === "completed"
                                    ? "bg-green-100 text-green-600"
                                    : inv.status === "pending"
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-red-100 text-red-600"
                            }`}
                        >
                            {inv.status}
                        </span>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
}