'use client';

import { Search, Plus, Eye, Pencil, Trash2, Bell } from 'lucide-react';

export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: "End of Term Examinations",
      status: "Published",
      content: "End of term examinations will begin on June 20th. Please ensure all students are prepared.",
      by: "Admin",
      date: "01/06/2025",
      category: "Academic",
      audience: ["Teachers", "Students", "Parents"]
    },
    {
      id: 2,
      title: "Class Cancel",
      status: "Published",
      content: "Parent-Teacher meetings will be held on June 15th from 9:00 AM to 3:00 PM. Attendance is mandatory.",
      by: "Vice Principal Smith",
      date: "28/05/2025",
      category: "General",
      audience: ["Teachers", "Parents"]
    }
  ];

  const stats = [
    { label: "Total Announcements", value: 5, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Published", value: 4, color: "text-green-500", bg: "bg-green-50" },
    { label: "Drafts", value: 1, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition">
          <Plus size={20} />
          New Announcement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <Bell className={stat.color} size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search announcements" 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-orange-200">
            <option>All Categories</option>
            <option>Academic</option>
            <option>General</option>
            <option>Events</option>
          </select>
          <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-orange-200">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                    {announcement.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Bell size={14} />
                    {announcement.category}
                  </span>
                  <span>By {announcement.by}</span>
                  <span>{announcement.date}</span>
                  <span>Audience: {announcement.audience.join(', ')}</span>
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
  );
}
