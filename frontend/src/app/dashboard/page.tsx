"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User, Eye, Pencil, Trash2, Circle } from "lucide-react";
import { UserContext, UserProvider } from "../../context/userContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();

  const [nofClasses, setNoOfClasses] = useState(0)
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    announcements: 0
  });

  const { name, userType } =
    useContext(UserContext) || ({ name: "GUEST", userType: "guest" } as const);
  const role = (userType || "guest").toLowerCase();

  const fetchDashboardData = async () => {
    try {
      // Teacher class count fetch
      if (role === 'teacher') {
        const token = localStorage.getItem("TOKEN") || localStorage.getItem("token")
        const classes = await axios.get(
          "http://localhost:3000/api/v1/teachers/classes",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setNoOfClasses(classes.data?.data?.classes?.length || 0);
      }

      // Fetch global live announcements
      const annRes = await axios.get("http://localhost:3000/api/v1/announcements/getAnnouncements");
      if (annRes.data.code === 200) {
        setAnnouncements(annRes.data.data);
      }

      // Admin stats fetch
      if (role === 'admin') {
        const usersRes = await axios.get("http://localhost:3000/api/v1/auth/allUsers");
        const classesRes = await axios.get("http://localhost:3000/api/v1/classes/getClasses", { withCredentials: true });
        
        const allUsers = usersRes.data.data || [];
        
        setAdminStats({
          students: allUsers.filter((u:any) => u.userType === 'student').length,
          teachers: allUsers.filter((u:any) => u.userType === 'teacher').length,
          classes: classesRes.data?.data?.length || 0,
          announcements: annRes.data.data.length
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [role]);

  const handleLogOut = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4 pr-4">
        <section className="px-6 py-4">
          <h1 className="text-xl font-semibold ">Welcome {name || "Guest"}</h1>
          <p className="text-sm text-gray-600">
            Here's what's happening with your account today.
          </p>
        </section>

        {role === "admin" && (
          <>
            <div>
              <div className="flex justify-evenly ">
                {Object.entries(adminStats).map(([key, val], idx) => (
                  <div
                    key={idx}
                    className="bg-white hover:bg-orange-50 w-40 h-36 border rounded-2xl shadow-sm border-gray-100 flex flex-col justify-between overflow-hidden transition"
                  >
                    <div className="flex flex-col gap-2 justify-center items-center h-full pt-4">
                      <User className="text-orange-600" />
                      <div className="font-bold text-gray-800 text-lg">{val}</div>
                      <div className="text-sm text-gray-500 capitalize">Total {key}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-evenly w-full gap-4 mx-2">
              {[1, 2].map((col) => (
                <div
                  key={col}
                  className="border rounded-2xl w-full h-full gap-4 "
                >
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
                                Audience: {(Array.isArray(announcement.audience) ? announcement.audience : JSON.parse(announcement.audience || "[]")).join(", ")}
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
              ))}
            </div>
          </>
        )}

        {role !== "admin" && (
          <div className="space-y-6 px-4 pb-6">
            {/* Quick summary cards per role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {role === "student" && (
                <>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Next class</p>
                    <p className="text-lg font-semibold">Math - 2:00 PM</p>
                  </div>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Assignments</p>
                    <p className="text-lg font-semibold">2 due this week</p>
                  </div>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Payments</p>
                    <p className="text-lg font-semibold">No pending dues</p>
                  </div>
                </>
              )}

              {role === "teacher" && (
                <>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Classes today</p>
                    <p className="text-lg font-semibold"> { nofClasses} sessions</p>
                  </div>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">
                      Assignments to grade
                    </p>
                    <p className="text-lg font-semibold">12 pending</p>
                  </div>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Messages</p>
                    <p className="text-lg font-semibold">5 new</p>
                  </div>
                </>
              )}

              {role === "parent" && (
                <>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Child progress</p>
                    <p className="text-lg font-semibold">
                      Latest report available
                    </p>
                  </div>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Payments</p>
                    <p className="text-lg font-semibold">
                      Invoice #124 due soon
                    </p>
                  </div>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="text-lg font-semibold">Perfect this week</p>
                  </div>
                </>
              )}

              {role === "guest" && (
                <>
                  <div className="bg-white border rounded-2xl p-4 shadow-sm col-span-1 sm:col-span-2 lg:col-span-3">
                    <p className="text-sm text-gray-500">Welcome</p>
                    <p className="text-lg font-semibold">
                      Explore announcements and updates.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Announcements shared for all non-admin roles */}
            <div className="border rounded-2xl w-full h-full gap-4 bg-white shadow-sm">
              <div className="px-4 py-3 font-semibold">
                Latest announcements
              </div>
              <div className="space-y-4 p-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white p-4 rounded-xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-gray-800">
                        {announcement.title}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                        {announcement.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Bell size={14} />
                        {announcement.category}
                      </span>
                      <span>{announcement.date}</span>
                      <span>Audience: {(Array.isArray(announcement.audience) ? announcement.audience : JSON.parse(announcement.audience || "[]")).join(", ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
