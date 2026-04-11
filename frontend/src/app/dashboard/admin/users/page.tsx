"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  QrCode,
  X,
  Download
} from "lucide-react";
import axios from "axios";
import { QRCodeSVG } from 'qrcode.react';

export default function ManageUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [qrModalUser, setQrModalUser] = useState<any>(null);

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
    getAllUsers();
  }, []);

  const filteredUsers = allUsers.filter((user: any) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "All Roles" || user.userType === selectedRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log("paginated user", paginatedUsers);

  const getRoleStyle = (role: string) => {
    switch (role?.toLowerCase()) {
      case "teacher":
        return "bg-blue-100 text-blue-600";
      case "student":
        return "bg-indigo-100 text-indigo-600";
      case "parent":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusStyle = (status: boolean) => {
    return status === true
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  };

  const handleAddUser = () => {
    router.push("/dashboard/admin/users/new");
  };

  const handleEditUser = (userId: number) => {
    router.push(`/dashboard/admin/users/${userId}/edit`);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      console.log("Deleting user:", userId);
      // Add delete API call here
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mx-2">
        <h2 className="text-2xl font-bold text-gray-800 ">Manage Users</h2>
        <button
          onClick={handleAddUser}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition my-2"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mx-2">
        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 "
              size={18}
            />
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
          >
            <option>All Roles</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">Name</th>
                <th className="px-8 py-4 font-semibold">Email</th>
                <th className="px-8 py-4 font-semibold text-center">Role</th>
                <th className="px-8 py-4 font-semibold text-center">Status</th>
                <th className="px-8 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              {paginatedUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-5 font-bold text-gray-800">
                    {user.firstName}
                  </td>
                  <td className="px-8 py-5 text-gray-500 text-sm">
                    {user.email}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase ${getRoleStyle(user.userType)}`}
                      >
                        {user.userType}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(user.isDelete)}`}
                      >
                        {!user.isDelete ? "Active" : "DeActivated"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-3 text-blue-500">
                      {user.userType?.toLowerCase() === 'student' && (
                        <button
                          onClick={() => setQrModalUser(user)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
                          title="Generate QR Code for Student"
                        >
                          <QrCode size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="p-1 hover:bg-blue-50 rounded-md transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 hover:bg-red-50 text-red-500 rounded-md transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))} 
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-gray-50 flex justify-between items-center text-sm text-gray-400 font-medium">
          <span>
            Showing{" "}
            {paginatedUsers.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 font-bold flex items-center justify-center">
              {currentPage}
            </button>
            <button
              onClick={handleNextPage}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Students */}
      {qrModalUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center border-b border-gray-100 relative">
              <button 
                onClick={() => setQrModalUser(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition bg-gray-50 rounded-full p-2"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-gray-800">Student Tag</h3>
              <p className="text-sm text-gray-500 mt-1">{qrModalUser.firstName}</p>
            </div>
            <div className="p-8 flex flex-col items-center bg-gray-50">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                <QRCodeSVG 
                  id={`qr-code-${qrModalUser.id}`} 
                  value={JSON.stringify({ id: qrModalUser.id, email: qrModalUser.email, role: 'student' })} 
                  size={200} 
                  level="H" 
                  includeMargin={true}
                />
              </div>
              <button 
                onClick={() => {
                  const svg = document.getElementById(`qr-code-${qrModalUser.id}`);
                  if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      ctx?.drawImage(img, 0, 0);
                      const pngFile = canvas.toDataURL("image/png");
                      const downloadLink = document.createElement("a");
                      downloadLink.download = `Student_QR_${qrModalUser.id}.png`;
                      downloadLink.href = `${pngFile}`;
                      downloadLink.click();
                    };
                    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
                  }
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Download size={18} /> Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
