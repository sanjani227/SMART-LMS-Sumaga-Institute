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
} from "lucide-react"; // Using lucide-react for the icons
import { access } from "fs";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { UserProvider } from "@/src/context/userContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      // active: active,
    },
    {
      name: "Manage Users",
      icon: <Users size={20} />,
      path: "/dashboard/users",
      // active: active,
    },
    {
      name: "Manage Classes",
      icon: <BookOpen size={20} />,
      path: "/dashboard/classes",
      // active: active,
    },
    {
      name: "Reports",
      icon: <FileText size={20} />,
      path: "/dashboard/reports",
      // active: active,
    },
    {
      name: "Announcements",
      icon: <Bell size={20} />,
      path: "/dashboard/announcements",
      // active: active,
    },
    {
      name: "Income Overview",
      icon: <BarChart3 size={20} />,
      path: "/dashboard/income",
      // active: active,
    },
    {
      name: "Settings",
      icon: <UserCircle size={20} />,
      path: "/dashboard/settings",
      // active: active,
    },
  ];

  return (
    <UserProvider>
      <div className="flex ">
        <div className="w-60 shrink-0 h-screen bg-gray-200 flex flex-col">
          <h1 className="flex text-orange-600 font-bold  pt-2 mb-4 text-2xl justify-center items-center">
            Sumaga Institute
          </h1>
          <div className="flex flex-col ">
            {menuItems.map((item) => {
              const isActive = pathName == item.path;
              return (
                <Link href={item.path} key={item.name} className="block ">
                  <div
                    className={`flex flex-row gap-4 transition ${
                      isActive
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
        <div className="grow ">{children}</div>
      </div>
    </UserProvider>
  );
}
