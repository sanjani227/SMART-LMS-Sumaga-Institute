import axios from "axios";
import { File, TruckElectric, X } from "lucide-react";
import { useEffect, useState } from "react";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  //   subjects: { subjectId: number; subjectName: string }[];
}

export default function UploadModal({
  open,
  onClose,
  onSuccess,
}: UploadModalProps) {
  if (!open) return null;
  const [files, setFiles] = useState<FileList | null>(null);
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);

    const formData = new FormData();

    for (let i = 0; i < files!.length; i++) {
      formData.append("files", files![i]);
    }

    formData.append("grade", grade);
    formData.append("subject", subject);
    const response = await axios.post(
      "http://localhost:3000/api/v1/teachers/uploadStudyMaterials",
        formData,
      {
        withCredentials: true,
      },
    );

    // console.log(response)
    onClose()
    onSuccess?.( );
    setUploading(false)


    // console.log(response.data.data);
  };

  const getSubject = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/v1/teachers/classes",
      {
        withCredentials: true,
      },
    );

    const data = response.data.data.classes[0].subject.subjectName;
    console.log("-----", data);

    setSubject(data);
  };

  useEffect(() => {
    getSubject();
  }, [uploadFile]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg bg-opacity-80">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <File /> Upload Study Materials
        </h2>

        <form className="space-y-2" onSubmit={uploadFile}>
          <div>
            <label className="block mb-1 font-medium">Files</label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Grade</option>
              {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Subject</option>
              {subject && <option value={subject}>{subject}</option>}
            </select>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
