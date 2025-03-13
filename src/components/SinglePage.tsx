import { useState } from "react";
import { Star, Download, Trash2, Edit, Save } from "lucide-react";

export const SinglePage = () => {
  const [file, setFile] = useState({
    name: "Example File",
    size: "1.2 MB",
    type: "PDF",
    uploaded: "2021-09-01",
    lastModified: "2021-09-01",
    location: "Documents",
    starred: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(file.name);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setFile({ ...file, name: editName });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-grow relative flex-col md:flex-row">
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
              <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow cursor-pointer">
                <Star className="text-yellow-400" />
              </button>
              {/* Open in Editor */}
              <button className="absolute bottom-2 left-2 p-2 bg-white rounded shadow cursor-pointer">
                Open
              </button>
            </div>
          </div>

          {/* File Information */}
          <div className="md:w-2/5 w-full p-4 space-y-4 border rounded-lg bg-white shadow-lg">
            {/* File Name (Editable) */}
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={file.name}
                    onChange={(e) => setFile({ ...file, name: e.target.value })} // Hier wird der Name aktualisiert
                    className="border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xl font-semibold w-full"
                  />
                  <button
                    onClick={handleSaveClick}
                    className="p-2 bg-green-500 text-white rounded shadow cursor-pointer"
                    title="Save filename"
                  >
                    <Save />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xl font-semibold underline">
                    {file.name}
                  </span>
                  <button
                    onClick={handleEditClick}
                    className="p-2 bg-gray-200 rounded shadow cursor-pointer"
                    title="Edit filename"
                  >
                    <Edit className="text-gray-500" />
                  </button>
                </>
              )}
            </div>

            {/* File Details */}
            <p>
              <strong>Date Added:</strong> {file.uploaded}
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

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded shadow cursor-pointer">
                <Download className="mr-2" /> Download
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded shadow cursor-pointer">
                <Trash2 className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
