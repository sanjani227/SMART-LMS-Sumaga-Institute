"use client";

import axios, { all } from "axios";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ManageClassesPage() {
  const [allClasses, setClasses] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [activeClasses, setActiveClasses] = useState(0)

  const getAllClasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/classes/getClasses",
        {
          withCredentials: true
        }
      );

      setClasses(response.data.data.map((e:any) => e));

       setActiveClasses(response.data.data.filter((e:any) => e.isDeleted == false).length)
      //  console.log("_______________", activeClasses)
       console.log("_______________", allClasses)

      

    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/allUsers",
      );
      console.log(" asbfjhabfjh", response.data.data);
      setAllUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



  useEffect(() => {
    getAllClasses();
    getAllUsers()
  }, []);

  // const classes = allClasses.map((e) => e)
  // console.log(classes)

  // const classes = [
  //   {
  //     name: "Mathematics",
  //     grade: "Grade 8",
  //     teacher: "Nilantha",
  //     students: 32,
  //     schedule: "Monday, Wednesday, Friday - 9:00 AM",
  //     status: "Active",
  //   },
  //   {
  //     name: "Sinhala",
  //     grade: "Grade 9",
  //     teacher: "Nimal",
  //     students: 28,
  //     schedule: "Tuesday, Thursday - 11:00 AM",
  //     status: "Active",
  //   },
  //   {
  //     name: "World History",
  //     grade: "Grade 10",
  //     teacher: "Kamal",
  //     students: 25,
  //     schedule: "Monday, Wednesday - 1:00 PM",
  //     status: "Active",
  //   },
  //   {
  //     name: "English Literature",
  //     grade: "Grade 8",
  //     teacher: "Ashoka",
  //     students: 30,
  //     schedule: "Tuesday, Thursday - 9:00 AM",
  //     status: "Active",
  //   },
  //   {
  //     name: "Physics",
  //     grade: "Grade 12",
  //     teacher: "Sumudu",
  //     students: 22,
  //     schedule: "Monday, Wednesday, Friday - 11:00 AM",
  //     status: "Inactive",
  //   },
  //   {
  //     name: "Science",
  //     grade: "Grade 7",
  //     teacher: "Sugath",
  //     students: 35,
  //     schedule: "Monday, Wednesday, Friday - 10:00 AM",
  //     status: "Active",
  //   },
  // ];

  const stats = [
    {
      label: "Total Classes",
      value: allClasses.length,
      icon: <BookOpen size={24} />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Active Classes",
      value: activeClasses,
      icon: <CheckCircle size={24} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Total Students",
      value: allUsers.length,
      icon: <Users size={24} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center px-2 py-2">
        <h2 className="text-2xl font-bold text-gray-800">Manage Classes</h2>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition">
          <Plus size={20} />
          Add Class
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div
              className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search classes"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
          />
        </div>
        <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-orange-200">
          <option>All Grades</option>
          {[7, 8, 9, 10, 11, 12, 13].map((g) => (
            <option key={g}>Grade {g}</option>
          ))}
        </select>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Class Name</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allClasses.map((cls, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-orange-600" size={18} />
                      </div>
                      <span className="font-semibold text-gray-800">
                        {cls.subject.subjectName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{cls.subject.gradeLevel}</td>
                  <td className="px-6 py-4 text-gray-600">{cls.teacher.fullName}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                      {cls.students} Students
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {cls.scheduleDay}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cls.isDeleted === false
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-red-400"
                      }`}
                    >
                      {cls.isDeleted ? "Deactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition">
                        <Pencil size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing 1 to 6 of 6 classes</p>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <ChevronLeft size={18} />
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold">
              1
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
