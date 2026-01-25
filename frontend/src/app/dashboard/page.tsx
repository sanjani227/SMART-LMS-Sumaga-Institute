"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User, Eye, Pencil, Trash2, Circle } from "lucide-react";
import { UserContext, UserProvider } from "../../context/userContext";
import { useContext } from "react";

export default function DashboardPage() {
  const router = useRouter();

  const { name } = useContext(UserContext) || { name: "GUEST" };

  const announcements = [
    {
      id: 1,
      title: "End of Term Examinations",
      status: "Published",
      content:
        "End of term examinations will begin on June 20th. Please ensure all students are prepared.",
      by: "Admin",
      date: "01/06/2025",
      category: "Academic",
      audience: ["Teachers", "Students", "Parents"],
    },
    {
      id: 2,
      title: "Class Cancel",
      status: "Published",
      content:
        "Parent-Teacher meetings will be held on June 15th from 9:00 AM to 3:00 PM. Attendance is mandatory.",
      by: "Vice Principal Smith",
      date: "28/05/2025",
      category: "General",
      audience: ["Teachers", "Parents"],
    },
  ];

  const handleLogOut = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <>
      <div className="flex w-full justify-end bg-gray-100 gap-4 py-2 pr-4">
        <button>
          <div className="relative">
            <Bell></Bell>
            <Circle className="absolute -top-1 -right-1 size-2 bg-black rounded-2xl"></Circle>
          </div>
        </button>
        <Image
          src="/avatar.png"
          alt="logged-in-avatar"
          width={30}
          height={30}
        ></Image>

        <h3> {name || "GUEST"} </h3>

        <LogOut onClick={handleLogOut}></LogOut>
      </div>

      <div className="flex flex-col  w-full gap-4 pr-4">
        <section className="px-6 py-4">
          <h1 className="text-xl font-semibold ">Welcome Perera</h1>
          <p className="text-sm text-gray-600">
            Here's what's happening with your account today.
          </p>
        </section>

        <div>
          <div className="flex justify-evenly ">
            <div className="bg-white-400 w-[162] h-[152] border rounded-2xl   border-black">
              <div className=" flex gap-2 justify-center items-center content-center h-[100]">
                <User />
                <div>Total Students 1,234</div>
              </div>

              <div className="bg-gray-300 h-[52] border-b rounded-b-2xl  flex justify-center items-center border-black ">
                <span className="text-green-600">12%</span>{" "}
                <span>from last month</span>
              </div>
            </div>
            <div className="bg-white-400 w-[162] h-[152] border rounded-2xl   border-black">
              <div className=" flex gap-2 justify-center items-center content-center h-[100]">
                <User />
                <div>Total Students 1,234</div>
              </div>

              <div className="bg-gray-300 h-[52] border-b rounded-b-2xl   border-black content-center">
                <span className="text-green-600">12%</span>{" "}
                <span>from last month</span>
              </div>
            </div>
            <div className="bg-white-400 w-[162] h-[152] border rounded-2xl   border-black">
              <div className=" flex gap-2 justify-center items-center content-center h-[100]">
                <User />
                <div>Total Students 1,234</div>
              </div>

              <div className="bg-gray-300 h-[52] border-b rounded-b-2xl   border-black content-center">
                <span className="text-green-600">12%</span>{" "}
                <span>from last month</span>
              </div>
            </div>
            <div className="bg-white-400 w-[162] h-[152] border rounded-2xl   border-black">
              <div className=" flex gap-2 justify-center items-center content-center h-[100]">
                <User />
                <div>Total Students 1,234</div>
              </div>

              <div className="bg-gray-300 h-[52] border-b rounded-b-2xl   border-black content-center">
                <span className="text-green-600">12%</span>{" "}
                <span>from last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-evenly w-full gap-4 mx-2">
          <div className="border rounded-2xl w-full h-full gap-4 ">
            Recent Announcements
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {announcement.title}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                          {announcement.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Bell size={14} />
                          {announcement.category}
                        </span>
                        <span>By {announcement.by}</span>
                        <span>{announcement.date}</span>
                        <span>
                          Audience: {announcement.audience.join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition">
                        <Pencil size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded-2xl w-full h-full gap-4">
            Recent Announcements
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {announcement.title}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                          {announcement.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Bell size={14} />
                          {announcement.category}
                        </span>
                        <span>By {announcement.by}</span>
                        <span>{announcement.date}</span>
                        <span>
                          Audience: {announcement.audience.join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition">
                        <Pencil size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
