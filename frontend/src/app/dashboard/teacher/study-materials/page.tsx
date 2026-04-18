"use client";
import axios from "axios";
import { Delete, Download, File, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import UploadModal from "./uploadModal";
// import UploadModal from "./UploadModal.js";

export default function StudyMaterials() {
  const [uploadedFiles, setUploadedFile] = useState<any[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const getAllUploadedFiles = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/getStudyMaterials`,
      {
        withCredentials: true,
      },
    );

    const data = response.data.data;
    setUploadedFile(data);
    console.log(data);
  };

  useEffect(() => {
    getAllUploadedFiles();
  }, []);

  return (
    <div className="mx-2 my-2">
      <div className="flex justify-between mb-2">
        <h1 className="font-bold text-2xl">Study Materials</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="flex justify-end rounded-2xl bg-[rgba(234,88,12)] px-2 py-2 gap-2 items-center h-[38]"
        >
          <Plus className="text-white" />
          <span className="font-bold text-white ">upload</span>
        </button>

        <UploadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={getAllUploadedFiles}
        //   subjects={[]}
        />
      </div>

      <div className="space-y-3">
        {uploadedFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No study materials found</p>
            <p className="text-sm">
              Upload your first study material to get started
            </p>
          </div>
        ) : (
          uploadedFiles.map((material) => (
            <div
              key={material.fileId}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-center justify-between">
                {/* Left: File Info */}
                <div className="flex items-center gap-4 flex-1">
                  {/* <div className="flex-shrink-0">
                    {getFileIcon(material.fileName)}
                  </div> */}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {material.fileName.replace(/\.[^/.]+$/, "")}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {material.teacher.specialization || "Mathematics"}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Grade {material.grade}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        PDF
                      </span>
                      {/* <span>{formatFileSize(material.fileSize || 2400000)}</span> */}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Uploaded on {material.createdAt} •{" "}
                      {material.downloadCount || Math.floor(Math.random() * 50)}{" "}
                      downloads
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setClickCount((prev) => prev + 1)}
                    // onClick={() => handleDownload(material.fileId, material.fileName)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    // onClick={() => handleDelete(material.fileId, material.fileName)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {uploadedFiles.length}
          </div>
          <div className="text-sm text-orange-600">Total Files</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {uploadedFiles.length}
          </div>
          <div className="text-sm text-blue-600">PDF Files</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{clickCount}</div>
          <div className="text-sm text-green-600">Total Downloads</div>
        </div>

        {/* <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">3</div>
          <div className="text-sm text-purple-600">Recent Uploads</div>
        </div> */}
      </div>
    </div>
    //   </div>
  );
}
