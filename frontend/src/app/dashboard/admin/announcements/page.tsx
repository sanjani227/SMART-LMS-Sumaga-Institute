"use client";

import axios from "axios";
import { Search, Plus, Eye, Pencil, Trash2, Bell, X, Save } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    status: "Published",
    content: "",
    category: "General",
    audience: ["Teachers", "Students", "Parents"],
    date: new Date().toLocaleDateString("en-GB")
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/announcements/getAnnouncements`);
      if (res.data.code === 200) {
        setAnnouncements(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const payload = { ...formData, date: new Date().toLocaleDateString("en-GB"), by: "Admin" };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/announcements/createAnnouncement`, payload);
      setShowAddModal(false);
      fetchAnnouncements();
    } catch (err: any) {
      setSubmitError("Failed to create announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (ann: any) => {
    setFormData({
      id: ann.id,
      title: ann.title,
      status: ann.status,
      content: ann.content,
      category: ann.category,
      audience: typeof ann.audience === "string" ? JSON.parse(ann.audience) : ann.audience,
      date: ann.date
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/announcements/${formData.id}`, formData);
      setShowEditModal(false);
      fetchAnnouncements();
    } catch (err) {
      setSubmitError("Failed to update announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/announcements/${id}`);
        fetchAnnouncements();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const stats = [
    { label: "Total Announcements", value: announcements.length, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Published", value: announcements.filter(a => a.status === "Published").length, color: "text-green-500", bg: "bg-green-50" },
    { label: "Drafts", value: announcements.filter(a => a.status === "Draft").length, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button 
          onClick={() => {
            setFormData({ id: "", title: "", status: "Published", content: "", category: "General", audience: ["Teachers", "Students", "Parents"], date: "" });
            setShowAddModal(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition"
        >
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

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">No announcements found.</div>
        )}
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.status === "Published" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
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
                  <span>Audience: {(Array.isArray(announcement.audience) ? announcement.audience : JSON.parse(announcement.audience || "[]")).join(', ')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(announcement)} className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(announcement.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
            <button 
              onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6">{showEditModal ? "Edit Announcement" : "Create Announcement"}</h3>
            
            <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
              {submitError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{submitError}</div>}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Content</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  >
                    <option>General</option>
                    <option>Academic</option>
                    <option>Events</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  >
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition mt-4"
              >
                {isSubmitting ? "Saving..." : "Save Announcement"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
