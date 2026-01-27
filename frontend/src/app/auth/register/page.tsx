"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/src/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [userType, setUserType] = useState<"student" | "parent" | "teacher">(
    "student",
  );

  const typeOptions: Array<{
    label: string;
    value: "student" | "parent" | "teacher";
  }> = [
    { label: "STUDENT", value: "student" },
    { label: "PARENT", value: "parent" },
    { label: "TEACHER", value: "teacher" },
  ];

  const nameKey = "NAME";
  const userTypeKey = "USER_TYPE"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          firstName,
          lastName,
          email,
          password,
          userType
        },
      );

      console.log(response);
      const userLoggedEmail = response.data.data.email;
      const name = userLoggedEmail.split("@")[0];
      const userLoggedUserType = response.data.data.userType

      var local = localStorage.setItem(nameKey, name);
      var local = localStorage.setItem(userTypeKey, userLoggedUserType);
      console.log(local);

      toast.success("User logged successfully");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.message; // Fixed access to message

        if (status === 400) {
          toast.error(message || "Some Fields are Empty");
        } else if (status === 401) {
          toast.error("Unauthorized access");
        } else if (status === 404) {
          toast.error("User not found");
        } else if (status === 500) {
          toast.error("Server error. Please try again later");
        } else {
          toast.error(message || "Registration failed");
        }
      } else if (error.request) {
        toast.error("No response from server. Check your connection");
      } else {
        toast.error("An error occurred. Please try again");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl w-screen bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          {/* Graduation Cap Icon (Absolute Positioned) */}
          <div className="absolute top-4 left-4 w-20 h-20">
            <div className="text-5xl">🎓</div>{" "}
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-orange-500 italic">
              Sign Up
            </h1>
            <h2 className="text-4xl font-bold text-orange-600 mt-2 italic">
              Welcome
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex grow justify-around w-full bg-gray-200 py-2 px-1 rounded-2xl">
              {typeOptions.map((element) => {
                const active = userType == element.value;
                return (
                  <button
                  type="button"
                    key={element.value}
                    onClick={() => setUserType(element.value)}
                    className={`px-4 py-4 rounded-xl m-1 font-semibold sm:text-base md:text-sm transition ${
                      active
                        ? "bg-orange-400 text-white shadow w-full md:w-1/3 sm:w-1/4"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-300 w-full md:w-1/3 sm:w-1/4"
                    }`}
                  >
                    {element.label}
                  </button>
                );
              })}
            </div>

            <div>
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? "border-red-500" : "border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? "border-red-500" : "border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="email@gmail.com"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? "border-red-500" : "border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                Remember my preference
              </label>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="text-gray-800 font-bold hover:underline"
                onClick={() => router.push("/auth/login")}
              >
                Already have an account? <span>Login</span>
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-8">
          <div className="relative w-full h-full min-h-[400px]">
            <Image
              src="/login-image.png"
              alt="LMS Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Small Logout/Exit Icon at bottom right */}
      </div>
    </div>
  );
}
