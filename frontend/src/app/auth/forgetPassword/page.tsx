"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ForgotPasswordPage() {
  const route = useRouter();
  const [email, setEmail] = useState("");

  const validateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/validateEmail",
        {
          email,
        }
      );

      console.log(response)

      if (response.status == 200) {
        localStorage.setItem("RESET_EMAIL", email);
        toast.success("OTP sent to your email");
        setTimeout(() => {
          route.push("/auth/verifyOtp");
        }, 1500);
      } else {
        console.log("eroorafasf -1");
        toast.error("Email not found");
      }
    } catch (error) {
      toast.error("Email not found");
      console.log("eroorafasf-2")
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E6934A] p-4 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Main Card Container */}
      <div className="bg-white rounded-[40px] shadow-xl w-full max-w-2xl p-10 pt-0 flex flex-col items-center">
        {/* Logo Section - Matching the theme */}
        <div className="bg-white p-4 rounded-b-2xl shadow-sm mb-8">
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
          <p className="text-[8px] text-center text-gray-400 uppercase">
            Batagama
          </p>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Forgot Password
        </h1>

        {/* Form Section */}
        <form
          className="w-full max-w-lg space-y-8 flex flex-col items-center"
          onSubmit={validateEmail}
        >
          <div className="w-full space-y-3 text-center">
            <label className="text-2xl font-medium text-gray-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-[#EEEEEE] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-300 outline-none transition text-center text-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#001B3D] text-white text-xl font-bold py-3 px-24 rounded-full hover:bg-black transition-all duration-200 shadow-md"
          >
            Submit
          </button>

          {/* Bottom Link */}
          <div className="mt-4 text-xl text-gray-800">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold underline hover:text-orange-600 transition"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
