import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Star, Download, Trash2, Edit } from "lucide-react";

export const SinglePage = () => {
  const [file, setFile] = useState({
    name: "Example File",
    dateAdded: "2024-03-06",
    size: "2.3 MB",
    type: "PNG Image",
    lastModified: "2024-03-05",
    location: "My Drive/Images",
    tags: ["Work", "Personal"],
  });

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-grow relative flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow flex flex-col md:flex-row p-4 gap-4">
          {/* File Viewer */}
          <div className="md:w-3/5 w-full flex flex-col items-center justify-center border rounded-lg bg-gray-100 p-4 shadow-lg">
            <div className="relative w-full h-72 md:h-96 flex items-center justify-center bg-white border rounded-lg">
              {/* Placeholder for File Preview */}
              <img
                src="/placeholder.png"
                alt="File preview"
                className="max-w-full max-h-full object-contain"
              />
              {/* Star for Favorites */}
              <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow">
                <Star className="text-yellow-400" />
              </button>
              {/* Open in Editor */}
              <button className="absolute bottom-2 left-2 p-2 bg-white rounded shadow">
                Open
              </button>
            </div>
          </div>

          {/* File Information Panel */}
          <div className="md:w-2/5 w-full p-4 space-y-4 border rounded-lg bg-white shadow-lg">
            {/* File Name (Editable) */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={file.name}
                className="border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xl font-semibold w-full"
              />
              <Edit className="text-gray-500" />
            </div>

            {/* File Details */}
            <p>
              <strong>Date Added:</strong> {file.dateAdded}
            </p>
            <p>
              <strong>File Size:</strong> {file.size}
            </p>
            <p>
              <strong>Type:</strong> {file.type}
            </p>
            <p>
              <strong>Last Modified:</strong> {file.lastModified}
            </p>
            <p>
              <strong>Storage Location:</strong> {file.location}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {file.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded shadow">
                <Download className="mr-2" /> Download
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded shadow">
                <Trash2 className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
