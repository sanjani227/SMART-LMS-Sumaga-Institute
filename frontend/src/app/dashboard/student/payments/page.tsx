"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Wallet, CheckCircle2, Loader2, ArrowRight, Building, CreditCard, Upload } from "lucide-react";

interface Payment {
    paymentId: number;
    amount: string | number;
    paymentType: string;
    paymentMethod: string;
    status: "pending" | "completed" | "failed" | "refunded" | string;
    dueDate: string | null;
    paidDate: string | null;
    description: string | null;
}

export default function StudentPayments() {
    const [invoices, setInvoices] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Payment Modal States
    const [activeInvoice, setActiveInvoice] = useState<Payment | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer">("card");
    const [slipBase64, setSlipBase64] = useState<string>("");
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/payments`,
                { withCredentials: true }
            );

            if (response.data.code === 200) {
                const payload = response.data.data;
                if (Array.isArray(payload)) {
                    setInvoices(payload);
                } else {
                    setInvoices(payload?.payments || []);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setSlipBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const submitPayment = async () => {
        if (!activeInvoice) return;
        if (paymentMethod === "bank_transfer" && !slipBase64) {
            toast.error("Please upload your bank transfer slip.");
            return;
        }

        try {
            setIsPaying(true);
            const payload = {
                paymentMethod,
                slipUrl: paymentMethod === 'bank_transfer' ? slipBase64 : null
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/payments/${activeInvoice.paymentId}/pay`,
                payload,
                { withCredentials: true }
            );

            if (response.data.code === 200) {
                toast.success(paymentMethod === "card" ? "Payment successful!" : "Transfer slip submitted for review!");
                setActiveInvoice(null);
                setSlipBase64("");
                await fetchPayments();
            } else {
                toast.error(response.data.message || "Failed to process payment");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error processing payment");
        } finally {
            setIsPaying(false);
        }
    };

    const stats = useMemo(() => {
        const totalDue = invoices
            .filter((inv) => (inv.status || "").toLowerCase() === "pending")
            .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
        const totalPaid = invoices
            .filter((inv) => (inv.status || "").toLowerCase() === "completed")
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

    return (
      <div className="p-6 space-y-6 relative">
        <ToastContainer position="top-right" autoClose={3000} />
  
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payments & Fees</h1>
            <p className="text-sm text-gray-500">Review your payment history and pending dues</p>
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
              There are no payment records or pending invoices for your account.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
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
                    <div key={inv.paymentId} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-gray-50">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <p className="font-bold text-gray-800 capitalize text-lg hover:text-orange-600 transition">{inv.paymentType.replace("_", " ")}</p>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    (inv.status || "").toLowerCase() === "completed" ? "bg-green-100 text-green-700" :
                                    (inv.status || "").toLowerCase() === "pending" ? "bg-orange-100 text-orange-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                    {String(inv.status)}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-500">Amount: <strong className="text-gray-700">Rs. {Number(inv.amount).toFixed(2)}</strong></p>
                        </div>
                        {String(inv.status).toLowerCase() === "pending" && (
                            <button 
                                onClick={() => { setActiveInvoice(inv); setSlipBase64(""); }}
                                className="px-5 py-2 bg-orange-600 text-white rounded-xl font-semibold shadow-sm hover:bg-orange-700 transition flex items-center gap-2"
                            >
                                Pay Now <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* Payment Processing Modal Overlay */}
        {activeInvoice && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                    {/* Header */}
                    <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Make a Payment</h3>
                            <p className="text-orange-100 text-sm opacity-90">Secure encrypted checkout process</p>
                        </div>
                        <button onClick={() => setActiveInvoice(null)} className="text-orange-200 hover:text-white transition">
                            <ArrowRight className="rotate-45" size={24} />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b pb-1 mb-2">Invoice Summary</p>
                                <p className="font-bold text-gray-800 capitalize text-lg">{activeInvoice.paymentType.replace("_", " ")}</p>
                            </div>
                            <p className="text-2xl font-black text-orange-600">Rs. {Number(activeInvoice.amount).toLocaleString()}</p>
                        </div>

                        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                            <button 
                                onClick={() => setPaymentMethod("card")}
                                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-lg font-bold transition text-sm ${paymentMethod === "card" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:bg-gray-200"}`}
                            >
                                <CreditCard size={18} /> Online Platform
                            </button>
                            <button 
                                onClick={() => setPaymentMethod("bank_transfer")}
                                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-lg font-bold transition text-sm ${paymentMethod === "bank_transfer" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:bg-gray-200"}`}
                            >
                                <Building size={18} /> Bank Transfer
                            </button>
                        </div>

                        {paymentMethod === "bank_transfer" && (
                            <div className="mb-6 space-y-4">
                                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                                    <p className="text-sm text-orange-800 font-semibold mb-1">Bank Instructions</p>
                                    <p className="text-xs text-orange-700">Transfer funds to: Smart LMS Institute<br/>A/C: 12435502010<br/>Bank: BOC / Branch: Main</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {slipBase64 ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle2 className="text-green-500" size={32} />
                                            <p className="text-sm font-bold text-gray-700">Slip Attached Successfully</p>
                                            <p className="text-xs text-gray-500">Tap to replace image</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-2">
                                                <Upload size={20} />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700">Click to upload deposit slip</p>
                                            <p className="text-xs text-gray-500">Supports JPG, PNG (Max 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {paymentMethod === "card" && (
                            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center h-40 flex flex-col justify-center items-center">
                                <CreditCard size={32} className="text-gray-400 mb-3 mx-auto" />
                                <p className="text-sm font-semibold text-gray-600 mb-1">Simulated Secure Gateway</p>
                                <p className="text-xs text-gray-400">Clicking Pay will instantly authorize the transaction</p>
                            </div>
                        )}

                        <button 
                            onClick={submitPayment}
                            disabled={isPaying || (paymentMethod === "bank_transfer" && !slipBase64)}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPaying ? <Loader2 className="animate-spin" /> : <Wallet />}
                            {isPaying ? "Processing..." : `Confirm Payment of Rs. ${Number(activeInvoice.amount).toLocaleString()}`}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
}
