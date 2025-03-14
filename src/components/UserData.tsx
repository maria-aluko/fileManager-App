import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import FileUploader from "./FileUploader";
import { FileDeleter } from "./FileDeleter";
import { moveFiles } from "../utils/moveFiles"; // Import move function
import FolderCreation from "./CreateFolder";
import file_icon from "../assets/file_icon.svg";
import LoadingSpinner from "../utils/LoadingSpinner";
import star from "../assets/star.png";
import starFilled from "../assets/star-filled.png";
import { useNavigate, useParams } from "react-router-dom";

interface File {
  id: string;
  name: string;
  file_size: number;
  type: string;
  created_at: string;
  url: string;
  tags: [Tag];
}

interface Tag {
  id: string;
  name: string;
}

const UserData: React.FC = () => {
  const [folders, setFolders] = useState<File[]>([]); // List of folders
  const [allItems, setAllItems] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filterStarredFiles, setFilterStarredFiles] = useState<boolean>(false);
  const [destinationFolder, setDestinationFolder] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();

  // Fetch user files
  const fetchUserData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("No access token found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      // fetches only the files in the folder with the id fileId
      if (fileId) {
        const params = new URLSearchParams({ parentIds: fileId });
        const response = await axios.get(
          `https://unelmacloud.com/api/v1/drive/file-entries?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setAllItems([data.data]);

        if (Array.isArray(data.data)) {
          setFolders(data.data.filter((file: File) => file.type === "folder"));
          setAllItems(data.data);
        } else {
          setError("Failed to load files.");
        }
      } else {
        // fetches all the files in the drive
        const response = await axios.get(
          "https://unelmacloud.com/api/v1/drive/file-entries",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;

        if (Array.isArray(data.data)) {
          setFolders(data.data.filter((file: File) => file.type === "folder"));
          setAllItems(data.data);
          // Separate folders
        } else {
          setError("Failed to load files.");
        }
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("An error occurred while fetching files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  //handle opening folder
  const handleFolderClick = (fileId: string, fileType: string) => {
    if (fileType === "folder") {
      window.location.href = `/user-data/${fileId}`;
    }
  };

  // Handle file selection for moving
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Handle moving files
  const handleMoveFiles = async () => {
    if (!destinationFolder) {
      alert("Please select a destination folder");
      return;
    }
    try {
      await moveFiles(selectedFiles, destinationFolder);
      alert("Files moved successfully!");
      setSelectedFiles([]);
      fetchUserData(); // Refresh file list
    } catch (error) {
      alert("Error moving files");
      console.log(error);
    }
  };

  // Original function for handling file upload
  const handleUpload = () => {
    fetchUserData();
  };

  // Original function for handling file deletion
  const handleFileDeleted = () => {
    fetchUserData();
  };

  const handleStarFile = async (fileId: string, fileTags: [Tag]) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }
    // below is the logic to star or unstar a file using the endpoints from the documentation star and unstar
    let url = "https://unelmacloud.com/api/v1/file-entries/star";
    if (checkStarred(fileTags)) {
      url = "https://unelmacloud.com/api/v1/file-entries/unstar";
      //When unstarring remove the tags from the file
      const updatedTags: [Tag] = [];
      const updatedFiles = allItems.map((file) => {
        if (file.id === fileId) {
          return { ...file, tags: updatedTags };
        } else {
          return file;
        }
      });
      setAllItems(updatedFiles);
    } else {
      // adding tag(starred tag) from response to correct file with id=fileid
      const updatedTags: [Tag] = [
        {
          id: "1",
          name: "starred",
        },
      ];
      const updatedFiles = allItems.map((file) => {
        if (file.id === fileId) {
          return { ...file, tags: updatedTags };
        } else {
          return file;
        }
      });
      setAllItems(updatedFiles);
    }

    try {
      const requestBody = { entryIds: [fileId] };

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      const axiosError = err as AxiosError;

      console.error("Star file error:", axiosError);

      if (axiosError.response) {
        console.error("Server response:", axiosError.response.data);
        setError(`Error: ${JSON.stringify(axiosError.response.data)}`);
      } else {
        setError("Failed to star the file. Please try again.");
      }
    }
  };

  const checkStarred = (fileTags: [Tag]) => {
    if (fileTags.some((tag) => tag.name === "starred")) {
      return true;
    }
    return false;
  };

  // handle back from folder
  const handleBack = () => {
    navigate("/user-data/0");
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center flex-col p-6 space-y-8">
      <h2 className="font-bold text-2xl mb-4 mt-24">Your Files</h2>

      {fileId !== "0" && (
        <button
          onClick={handleBack}
          className="bg-gray-300 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 cursor-pointer"
        >
          ← Back
        </button>
      )}

      {/* Controls section (Checkbox + Upload + New Folder) */}
      <div className="flex justify-between items-center w-full mb-6">
        {/* Favourites Checkbox */}
        <div className="flex items-center space-x-3">
          <label className="text-gray-700 font-medium">Favourites</label>
          <label className="relative inline-block w-14 h-8 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={filterStarredFiles}
              onChange={() => setFilterStarredFiles(!filterStarredFiles)}
            />
            <div className="absolute inset-0 bg-purple-300 rounded-full transition-all duration-400 peer-checked:bg-purple-600 peer-focus:ring-2 peer-focus:ring-purple-500"></div>
            <div className="absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-lg transition-all duration-400 peer-checked:translate-x-6 peer-checked:w-8 peer-checked:h-8 peer-checked:bottom-0"></div>
          </label>
        </div>

        {/* File Upload & Folder Creation Buttons */}
        <div className="flex items-center space-x-4">
          <FileUploader onUpload={handleUpload} />
          <FolderCreation onFolderCreate={fetchUserData} />
        </div>
      </div>

      {/* Files List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : allItems.length === 0 ? (
        <div>
          <p className="text-xl">No files available. Please upload a file!</p>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <div>
            <ul className="flex items-center flex-wrap flex-row space-x-4">
              {/* Functionality to show  Filtering starred files if the above checkbox is checked else it returns null to map function*/}
              {allItems.map((file) =>
                !filterStarredFiles || checkStarred(file.tags) ? (
                  <div
                    className="w-60 h-60 bg-gray-200 m-4 p-6 rounded-lg shadow-lg flex flex-col justify-between"
                    key={file.id}
                  >
                    <li>
                      <div className="flex items-center space-x-2 text-xl">
                        <img src={file_icon} alt="file" className="w-10 h-10" />
                        <strong
                          onClick={() => handleFolderClick(file.id, file.type)}
                          className="cursor-pointer hover:underline"
                        >
                          {file.name}
                        </strong>
                        <img
                          src={checkStarred(file.tags) ? starFilled : star}
                          alt="Star"
                          className="cursor-pointer w-6 h-6"
                          onClick={() => handleStarFile(file.id, file.tags)}
                        />
                      </div>
                      <p className="text-sm mt-2">
                        <strong>File Size:</strong>{" "}
                        {(file.file_size / 1000000).toFixed(3)} MB
                      </p>
                      <p className="text-sm">
                        <strong>File Type:</strong> {file.type}
                      </p>
                      <p className="text-sm">
                        <strong>Uploaded on:</strong>{" "}
                        {file.created_at.slice(0, 10)}
                      </p>
                      <FileDeleter
                        fileId={file.id}
                        onDelete={handleFileDeleted}
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="mr-2"
                        />
                        <label>Select for moving</label>
                      </div>
                    </li>
                  </div>
                ) : null
              )}
            </ul>
          </div>

          {/* Folder selection dropdown */}
          <div>
            <label className="block text-lg font-medium">Move to folder:</label>
            <select
              className="border p-2 rounded"
              value={destinationFolder || ""}
              onChange={(e) => setDestinationFolder(e.target.value)}
            >
              <option value="">Select Folder</option>
              {folders.map((folder: File) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleMoveFiles}
              className="bg-blue-500 text-white p-2 mt-4 rounded"
            >
              Move Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserData;
