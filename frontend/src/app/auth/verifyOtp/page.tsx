"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function VerifyOtpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem("RESET_EMAIL");
        if (!storedEmail) {
            toast.error("No email found. Please start from forgot password page.");
            router.push("/auth/forgetPassword");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setIsSubmitting(true);
        try {
            // NOTE: Using port 3000 for backend API calls
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verifyOtp`, {
                email,
                otp
            });

            if (response.status === 200) {
                toast.success("OTP verified successfully");
                setTimeout(() => {
                    router.push("/auth/changePassword");
                }, 1000);
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to verify OTP";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#E6934A] p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="bg-white rounded-[40px] shadow-xl w-full max-w-md p-8 pt-0 flex flex-col items-center">

                {/* Logo Section */}
                <div className="bg-white p-4 rounded-b-2xl shadow-sm mb-6">
                    <Image
                        src="/logo.png"
                        alt="Sumaga Institute Logo"
                        width={100}
                        height={100}
                        className="object-contain"
                    />
                    <p className="text-[10px] text-center font-bold tracking-widest text-gray-500 mt-1 uppercase">
                        Sumaga Institute
                    </p>
                    <p className="text-[8px] text-center text-gray-400 uppercase">Batagama</p>
                </div>

                {/* Form Title */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Verify OTP
                </h1>
                <p className="text-sm text-gray-600 mb-8 text-center">
                    We've sent a 6-digit code to<br />
                    <span className="font-semibold">{email}</span>
                </p>

                {/* OTP Form */}
                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-lg font-medium text-gray-700 ml-1">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            maxLength={6}
                            className="w-full bg-[#EEEEEE] border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-300 outline-none transition text-center text-2xl tracking-widest font-semibold"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-center">
                        <button
                            type="submit"
                            disabled={isSubmitting || otp.length !== 6}
                            className="bg-[#001B3D] text-white text-xl font-bold py-3 px-16 rounded-full hover:bg-black transition-colors duration-200 disabled:opacity-50"
                        >
                            {isSubmitting ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
