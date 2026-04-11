"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FileText, Upload, Trash2, Calendar, Book, Download, Plus, X 
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchClasses();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.get("http://localhost:3000/api/v1/teachers/getStudyMaterials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        setMaterials(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching materials", error);
      toast.error("Failed to load study materials");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.get("http://localhost:3000/api/v1/teachers/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data?.classes) {
        setClasses(res.data.data.classes);
        if (res.data.data.classes.length > 0) {
          setSelectedClassId(res.data.data.classes[0].classId.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching classes", error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !title || !files || files.length === 0) {
      toast.error("Please fill all required fields and select a file");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("TOKEN");
      const formData = new FormData();
      formData.append("classId", selectedClassId);
      formData.append("title", title);
      formData.append("description", description);
      
      // Append all selected files
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const res = await axios.post(
        "http://localhost:3000/api/v1/teachers/uploadStudyMaterials",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          },
        }
      );

      if (res.data.code === 200 || res.data.code === 201) {
        toast.success("Materials uploaded successfully!");
        setIsUploadModalOpen(false);
        // Reset form
        setTitle("");
        setDescription("");
        setFiles(null);
        fetchMaterials();
      } else {
        toast.error(res.data.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error uploading materials");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Study Materials</h1>
          <p className="text-sm text-gray-500">Upload and manage resources for your classes</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Upload size={20} />
          Upload New Material
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center text-gray-500">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg">No study materials uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div key={mat.materialId} className="bg-white rounded-2xl border hover:shadow-md transition p-5 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-bold text-gray-800 truncate" title={mat.title}>
                    {mat.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-orange-600 font-medium bg-orange-50 w-max px-2 py-0.5 rounded-full">
                    <Book size={12} />
                    Class {mat.classId}
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                  <FileText size={24} />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">
                {mat.description || "No description provided."}
              </p>

              <div className="space-y-3 mt-auto">
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500 font-medium mb-2">Attached Files:</p>
                  {mat.fileUrl ? (
                    <a 
                      href={`http://localhost:3000/${mat.fileUrl}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition group"
                    >
                      <span className="text-sm text-gray-700 truncate mr-2">
                        {mat.fileUrl.split('/').pop()}
                      </span>
                      <Download size={16} className="text-gray-400 group-hover:text-orange-500 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No valid file link</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(mat.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Upload Study Material</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  required
                >
                  {classes.length === 0 && <option value="">No classes available</option>}
                  {classes.map((cls) => (
                    <option key={cls.classId} value={cls.classId}>
                      Class {cls.classId}: {cls.subject?.subjectName} ({cls.scheduleDay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 1 Notes"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details about this material..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Files
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500 px-2 py-1">
                        <span>Select file(s)</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={(e) => setFiles(e.target.files)}
                          required
                        />
                      </label>
                    </div>
                    {files && files.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {files.length} file(s) selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || classes.length === 0}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    "Upload Material"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
