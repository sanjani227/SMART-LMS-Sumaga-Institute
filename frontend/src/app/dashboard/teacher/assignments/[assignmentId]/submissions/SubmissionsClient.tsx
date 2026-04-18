"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, CheckCircle2, Clock, User, FileText, Send 
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubmissionsClient() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.assignmentId;
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Grading Modal State
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.get(
        `http://localhost:3000/api/v1/teachers/assignments/${assignmentId}/submissions`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.data) {
        setSubmissions(res.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching submissions", error);
      toast.error(error.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || parseFloat(score) < 0) {
      toast.error("Please enter a valid score");
      return;
    }

    setGrading(true);
    try {
      const token = localStorage.getItem("TOKEN");
      const res = await axios.put(
        `http://localhost:3000/api/v1/teachers/assignments/submissions/${selectedSubmission.submissionId}/grade`,
        {
          score: parseFloat(score),
          feedback
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.code === 200) {
        toast.success("Submission graded successfully");
        setIsGradeModalOpen(false);
        fetchSubmissions(); // Refresh list to get updated status
      } else {
        toast.error(res.data.message || "Failed to grade submission");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error grading submission");
    } finally {
      setGrading(false);
    }
  };

  const openGradeModal = (submission: any) => {
    setSelectedSubmission(submission);
    setScore(submission.score !== null ? submission.score.toString() : "");
    setFeedback(submission.feedback || "");
    setIsGradeModalOpen(true);
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-6">
        <button 
          onClick={() => router.push("/dashboard/teacher/assignments")}
          className="flex items-center text-sm text-gray-500 hover:text-orange-500 transition mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Assignments
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Student Submissions</h1>
        <p className="text-sm text-gray-500">Review and grade submissions for this assignment</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-lg">No submissions yet for this assignment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-sm text-gray-600">
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Submitted At</th>
                  <th className="p-4 font-medium">Files</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {submissions.map((sub) => (
                  <tr key={sub.submissionId} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{sub.student?.fullName || "Unknown Student"}</div>
                          <div className="text-xs text-gray-500">{sub.student?.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {sub.fileUrl ? (
                        <a 
                          href={`http://localhost:3000/${sub.fileUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
                        >
                          <FileText size={16} /> View Work
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No file attached</span>
                      )}
                    </td>
                    <td className="p-4">
                      {sub.status === "graded" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle2 size={12} /> Graded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          <Clock size={12} /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {sub.score !== null ? `${sub.score} pts` : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openGradeModal(sub)}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
                          sub.status === "graded" 
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                      >
                        {sub.status === "graded" ? "Edit Grade" : "Grade"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade Modal */}
      {isGradeModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Grade Submission</h2>
              <button
                onClick={() => setIsGradeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border mb-2">
                <p className="text-sm text-gray-500 mb-1">Student</p>
                <p className="font-medium text-gray-800">{selectedSubmission.student?.fullName}</p>
                {selectedSubmission.assignment && (
                  <p className="text-xs text-gray-500 mt-2">Max Score: {selectedSubmission.assignment.maxScore}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  max={selectedSubmission.assignment?.maxScore || 100}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grading}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {grading ? "Saving..." : <><Send size={18} /> Save Grade</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
