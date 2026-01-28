"use client";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Bell,
  BarChart3,
  UserCircle,
  LogOut,
  CheckSquare,
  ClipboardList,
  HelpCircle,
  Layers,
  MessageCircle,
  TrendingUp,
  Wallet,
  Circle,
} from "lucide-react"; // Using lucide-react for the icons
import { access } from "fs";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserContext, UserProvider } from "@/src/context/userContext";
import { UserType } from "../../utils/enum";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const router = useRouter();
  const { userType, name, setName, setUserType } = useContext(UserContext); // ✅ Now gets the actual value

  const menuItems = [
    // shared
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      role: ["admin", "student", "parent", "teacher"],
    },

    // admin
    {
      name: "Manage Users",
      icon: <Users size={20} />,
      path: "/dashboard/admin/users",
      role: ["admin"],
    },
    {
      name: "Manage Classes",
      icon: <BookOpen size={20} />,
      path: "/dashboard/admin/classes",
      role: ["admin"],
    },
    {
      name: "Reports",
      icon: <FileText size={20} />,
      path: "/dashboard/admin/reports",
      role: ["admin"],
    },
    {
      name: "Announcements",
      icon: <Bell size={20} />,
      path: "/dashboard/admin/announcements",
      role: ["admin"],
    },
    {
      name: "Income Overview",
      icon: <BarChart3 size={20} />,
      path: "/dashboard/admin/income",
      role: ["admin"],
    },
    {
      name: "Settings",
      icon: <UserCircle size={20} />,
      path: "/dashboard/admin/settings",
      role: ["admin"],
    },

    // student
    {
      name: "Attendance",
      icon: <CheckSquare size={20} />,
      path: "/dashboard/student/attendance",
      role: ["student"],
    },
    {
      name: "Payments",
      icon: <Wallet size={20} />,
      path: "/dashboard/student/payments",
      role: ["student"],
    },
    {
      name: "Courses",
      icon: <BookOpen size={20} />,
      path: "/dashboard/student/courses",
      role: ["student"],
    },
    {
      name: "Messages",
      icon: <MessageCircle size={20} />,
      path: "/dashboard/student/messages",
      role: ["student"],
    },
    {
      name: "Assignments",
      icon: <ClipboardList size={20} />,
      path: "/dashboard/student/assignments",
      role: ["student"],
    },
    {
      name: "Study Materials",
      icon: <Layers size={20} />,
      path: "/dashboard/student/materials",
      role: ["student"],
    },
    {
      name: "Quizzes",
      icon: <HelpCircle size={20} />,
      path: "/dashboard/student/quizzes",
      role: ["student"],
    },
    {
      name: "Progress",
      icon: <TrendingUp size={20} />,
      path: "/dashboard/student/progress",
      role: ["student"],
    },

    // teacher
    {
      name: "Assignments",
      icon: <ClipboardList size={20} />,
      path: "/dashboard/teacher/assignments",
      role: ["teacher"],
    },
    {
      name: "Attendance",
      icon: <CheckSquare size={20} />,
      path: "/dashboard/teacher/attendance",
      role: ["teacher"],
    },
    {
      name: "Quizzes",
      icon: <HelpCircle size={20} />,
      path: "/dashboard/teacher/quizzes",
      role: ["teacher"],
    },
    {
      name: "Courses",
      icon: <BookOpen size={20} />,
      path: "/dashboard/teacher/courses",
      role: ["teacher"],
    },

    {
      name: "Child Progress",
      icon: <TrendingUp size={20} />,
      path: "/dashboard/parent/child-progress",
      role: ["parent"],
    },
    {
      name: "Attendance",
      icon: <CheckSquare size={20} />,
      path: "/dashboard/parent/child-attendance",
      role: ["parent"],
    },
    {
      name: "Payments",
      icon: <Wallet size={20} />,
      path: "/dashboard/parent/child-payments",
      role: ["parent"],
    },

    //guest
    {
      name: "Announcements",
      icon: <Wallet size={20} />,
      path: "/dashboard/guest/announcements",
      role: ["guest"],
    },
  ];

  const visibleMenu = menuItems.filter((item) => item.role.includes(userType));
  console.log("Filtered menu:", visibleMenu, "userType:", userType);

  const handleLogOut = () => {
    localStorage.clear();
    setName("");
    setUserType("");
    router.push("/auth/login");
  };

  return (


    <div className="flex min-h-screen">
      <div className="w-60 shrink-0 bg-gray-200 flex flex-col">
        {/* sidebar content */}
        <h1 className="flex text-orange-600 font-bold pt-2 mb-4 text-2xl justify-center items-center">
          Sumaga Institute
        </h1>
        <div className="flex flex-col">
          {visibleMenu.map((item) => {
            const isActive = pathName === item.path;
            return (
              <Link href={item.path} key={item.name} className="block">
                <div
                  className={`flex flex-row gap-4 transition ${isActive
                      ? "bg-orange-200 text-orange-400 p-4"
                      : "text-gray-500 hover:bg-gray-50 p-4"
                    }`}
                >
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="grow flex flex-col">
        <div className="flex w-full justify-end bg-gray-100 gap-4 py-2 pr-4">
          <button>
            <div className="relative">
              <Bell></Bell>
              <Circle className="absolute -top-1 -right-1 size-2 bg-black rounded-2xl"></Circle>
            </div>
          </button>
          <Image src="/avatar.png" alt="logged-in-avatar" width={30} height={30} />
          <h3>{name || "Guest"}</h3>
          <LogOut onClick={handleLogOut}></LogOut>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserProvider>
  );
}
