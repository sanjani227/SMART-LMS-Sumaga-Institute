"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { User, Wallet, CheckCircle2, Clock, Loader2, ArrowUpRight, Receipt } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChildPaymentsPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingPayments, setFetchingPayments] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchPayments(selectedChild);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/children`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200 && response.data.data) {
        setChildren(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedChild(response.data.data[0].studentId.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load your enrolled children.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (studentId: string) => {
    try {
      setFetchingPayments(true);
      const token = localStorage.getItem("TOKEN");
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/children/${studentId}/payments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200) {
        setPaymentData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment records.");
    } finally {
      setFetchingPayments(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (children.length === 0) {
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

  // Calculate stats
  const totalPaid = paymentData
    .filter(p => p.status.toLowerCase() === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
  const totalPending = paymentData
    .filter(p => p.status.toLowerCase() === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

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
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white"
          >
            {children.map((child) => (
              <option key={child.studentId} value={child.studentId}>
                {child.fullName} - Grade {child.grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fetchingPayments ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : paymentData.length === 0 ? (
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
                  Rs. {totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={24} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">Pending Dues</p>
                <p className="text-3xl font-bold text-gray-800">
                  Rs. {totalPending.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <Clock size={24} />
              </div>
            </div>
          </div>

          {/* Payment History List */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2 text-gray-700 font-semibold">
              <Receipt size={18} />
              Invoice History
            </div>
            <div className="divide-y">
              {paymentData.map((payment) => {
                const isCompleted = payment.status.toLowerCase() === 'completed';
                return (
                  <div key={payment.paymentId} className="p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        isCompleted ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">
                          {payment.month || payment.paymentType || "School Fee"}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Ref: #{payment.paymentId.toString().padStart(5, '0')}</span>
                          <span>Issue Date: {new Date(payment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                      <span className="text-xl font-bold text-gray-800">
                        Rs. {parseFloat(payment.amount).toLocaleString()}
                      </span>
                      
                      <div className="mt-1">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                            Paid
                          </span>
                        ) : (
                          <button className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition shadow-sm">
                            Pay Now <ArrowUpRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}