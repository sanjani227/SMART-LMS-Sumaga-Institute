"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { User, BookOpen, Clock, Activity, Loader2, Target, CalendarDays, Award } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChildProgressPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingProgress, setFetchingProgress] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchProgress(selectedChild);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/children`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200 && response.data.data) {
        setChildren(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedChild(response.data.data[0].studentId.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load your enrolled children.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (studentId: string) => {
    try {
      setFetchingProgress(true);
      const token = localStorage.getItem("TOKEN");
      const response = await axios.get(
        `http://localhost:3000/api/v1/parents/children/${studentId}/progress`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200) {
        setProgressData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress data.");
    } finally {
      setFetchingProgress(false);
    }
  };

  // Helper function to figure out the grade letter
  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return { label: "A+", color: "bg-green-100 text-green-700 border-green-200" };
    if (percentage >= 80) return { label: "A", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    if (percentage >= 70) return { label: "B", color: "bg-blue-100 text-blue-700 border-blue-200" };
    if (percentage >= 60) return { label: "C", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    if (percentage >= 50) return { label: "D", color: "bg-orange-100 text-orange-700 border-orange-200" };
    return { label: "F", color: "bg-red-100 text-red-700 border-red-200" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white p-10 rounded-2xl border text-center">
          <User className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Children Found</h3>
          <p className="text-gray-500">
            We could not find any students linked to your account. Please contact the administration or ensure your profile is fully synced.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Child Progress</h1>
          <p className="text-sm text-gray-500">Track academic performance and assessment results</p>
        </div>

        <div className="w-full md:w-auto min-w-[250px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Child
          </label>
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white"
          >
            {children.map((child) => (
              <option key={child.studentId} value={child.studentId}>
                {child.fullName} - Grade {child.grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fetchingProgress ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : progressData.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center">
          <Activity className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Yet</h3>
          <p className="text-gray-500">
            There are no assessment results available for this student yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Target size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-800">{progressData.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <Award size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Average Score</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(progressData.reduce((acc, curr) => acc + curr.percentage, 0) / progressData.length)}%
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {progressData.filter(p => p.status === 'completed').length} / {progressData.length}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Results List */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2 text-gray-700 font-semibold">
              <Activity size={18} />
              Recent Assessments
            </div>
            <div className="divide-y">
              {progressData.map((result) => {
                const badge = getGradeBadge(result.percentage || 0);
                return (
                  <div key={result.resultId} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {result.assessment?.title || "Assessment"}
                        </h3>
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border">
                          {result.assessment?.assessmentType}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-2">
                        <span className="flex items-center gap-1.5">
                          <BookOpen size={16} className="text-gray-400" />
                          {result.assessment?.classSession?.subject?.subjectName || "Subject"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={16} className="text-gray-400" />
                          {result.assessment?.durationMinutes} mins
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={16} className="text-gray-400" />
                          Completed: {new Date(result.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 bg-gray-50 p-4 rounded-xl border self-start md:self-auto">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Score</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.score} <span className="text-sm text-gray-500 font-medium">/ {result.assessment?.totalQuestions}</span>
                        </p>
                      </div>
                      
                      <div className="w-px h-10 bg-gray-200"></div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Grade</p>
                        <div className={`px-3 py-1 rounded-lg border font-bold ${badge.color}`}>
                          {badge.label} <span className="text-sm opacity-75 ml-1">{Math.round(result.percentage)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}