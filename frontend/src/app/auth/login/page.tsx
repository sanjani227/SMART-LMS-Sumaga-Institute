"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "@/src/context/userContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/src/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);

  const nameKey = "NAME";
  const userTypeKey = "USER_TYPE"

  const { setName , setUserType} = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        {
          email: data.email,
          password: data.password,
        },
      );

      console.log(response.status);
      const userLoggedName = response.data.data.firstName;
      const userLoggedEmail = response.data.data.email;
      const userLoggedUserType = response.data.data.userType || "guest"

      const name =
        userLoggedName && userLoggedName.trim() !== ""
          ? userLoggedName
          : userLoggedEmail.split("@")[0];

      setName(name);
      setUserType(userLoggedUserType)


      var local = localStorage.setItem(nameKey, name);
      var local = localStorage.setItem(userTypeKey, userLoggedUserType);
      console.log(local);

      toast.success("User logged successfully");

      setTimeout(() => {
        switch (userLoggedUserType.toLowerCase()) {
          case "admin":
            router.push("/dashboard");
            break;
          case "student":
            router.push("/dashboard/");
            break;
          case "teacher":
            router.push("/dashboard/");
            break;
          case "parent":
            router.push("/dashboard/");
            break;
          case "guest":
          default:
            router.push("/dashboard/guest/announcements");
            break;
        }
      }, 1500);
      
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 400) {
          toast.error(message || "Invalid email or password");
        } else if (status === 401) {
          toast.error("Unauthorized access");
        } else if (status === 404) {
          toast.error("User not found");
        } else if (status === 500) {
          toast.error("Server error. Please try again later");
        } else {
          toast.error(message || "Login failed");
        }
      } else if (error.request) {
        toast.error("No response from server. Check your connection");
      } else {
        toast.error("An error occurred. Please try again");
      }

      console.log(error);
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
            <h1 className="text-4xl font-bold text-orange-500 italic">Login</h1>
            <h2 className="text-4xl font-bold text-orange-600 mt-2 italic">
              Welcome
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                onClick={() => router.push("/auth/register")}
              >
                Don't have an account? <span>Register</span>
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="text-gray-800 font-bold hover:underline"
                onClick={() => router.push("/auth/forgetPassword")}
              >
                Forgot Password?
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
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
        <div className="absolute bottom-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600">
          <LogOut size={24} />
        </div>
      </div>
    </div>
  );
}
