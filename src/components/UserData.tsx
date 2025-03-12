import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import FileUploader from "./FileUploader";
import { FileDeleter } from "./FileDeleter";
import file_icon from "../assets/file_icon.svg";
import LoadingSpinner from "../utils/LoadingSpinner";
import FileViewer from "./FileViewer"; // Import the FileViewer component
import star from "../assets/star.png";
import starFilled from "../assets/star-filled.png";

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
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null); // State for selected file URL

  const fetchUserData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("No access token found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://unelmacloud.com/api/v1/drive/file-entries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (Array.isArray(data.data)) {
        setFiles(data.data);
      } else {
        setError("Failed to load files, no files data available");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        setError("Unauthorized access - Please log in again");
      } else {
        setError("An error occurred while fetching files");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpload = () => {
    fetchUserData();
  };

  const handleFileDeleted = () => {
    fetchUserData();
  };

  const handleFileClick = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
  };

  const handleCloseViewer = () => {
    setSelectedFileUrl(null);
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
      const updatedFiles = files.map((file) => {
        if (file.id === fileId) {
          return { ...file, tags: updatedTags };
        } else {
          return file;
        }
      });
      setFiles(updatedFiles);
    } else {
      // adding tag(starred tag) from response to correct file with id=fileid
      const updatedTags: [Tag] = [
        {
          id: "1",
          name: "starred",
        },
      ];
      const updatedFiles = files.map((file) => {
        if (file.id === fileId) {
          return { ...file, tags: updatedTags };
        } else {
          return file;
        }
      });
      setFiles(updatedFiles);
    }
    try {
      const requestBody = { entryIds: [fileId] };

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If current file is unstarred, add star tag from response to the file
      // if (!checkStarred(fileTags)) {
      // sample response data when starring
      //   {
      //     "tag": {
      //         "id": 1,
      //         "name": "starred",
      //         "display_name": "Starred",
      //         "type": "label",
      //         "created_at": "2018-08-23T10:50:16.000000Z",
      //         "updated_at": "2018-08-23T10:50:16.000000Z",
      //         "user_id": null,
      //         "model_type": "tag"
      //     },
      //     "status": "success"
      // }

      // }
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

  // Checks if the file tags contains an object with the name "starred". returns true or false
  // input sample
  //   [
  //     {
  //         "id": 1,
  //         "name": "starred",
  //         "display_name": "Starred",
  //         "type": "label",
  //         "created_at": "2018-08-23T10:50:16.000000Z",
  //         "updated_at": "2018-08-23T10:50:16.000000Z",
  //         "user_id": null,
  //         "model_type": "tag"
  //     }
  // ]
  const checkStarred = (fileTags: [Tag]) => {
    if (fileTags.some((tag) => tag.name === "starred")) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex justify-center items-center flex-col p-6">
      <h2 className="font-bold text-2xl mb-4">Your Files</h2>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : files.length === 0 ? (
        <div>
          <p className="text-xl">No files available. Please upload a file!</p>
          <FileUploader onUpload={handleUpload} />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <ul className="flex items-center flex-wrap flex-row space-x-2 space-y-2">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="w-75 h-50 bg-gray-200 m-4 p-6 rounded-lg"
                >
                  <p className="flex flex-row text-xl">
                    <img src={file_icon} alt="file" className="w-8 h-8" />
                    <strong>{file.name}</strong>
                  </p>
                  <p>
                    <strong>File Size:</strong>{" "}
                    {(file.file_size / 1000000).toFixed(3)} MB
                  </p>
                  <p>
                    <strong>File Type:</strong> {file.type}
                  </p>
                  <p>
                    <strong>File ID:</strong> {file.id}
                  </p>
                  {/* <img className="img-preview" src={file.url} alt="thumbnail" /> */}
                  <p>
                    <strong>Uploaded on:</strong> {file.created_at.slice(0, 10)}
                  </p>
                  <p></p>
                  <button
                    onClick={() => handleFileClick(file.url)}
                    className="text-blue-500 underline"
                  >
                    Open
                  </button>
                  <img
                    src={checkStarred(file.tags) ? starFilled : star}
                    alt="Star"
                    className="cursor-pointer w-6 h-6"
                    onClick={() => handleStarFile(file.id, file.tags)}
                  />

                  <FileDeleter fileId={file.id} onDelete={handleFileDeleted} />
                </li>
              ))}
            </ul>
          </div>
          <FileUploader onUpload={handleUpload} />
        </div>
      )}

      {selectedFileUrl && (
        <FileViewer fileUrl={selectedFileUrl} onClose={handleCloseViewer} />
      )}
    </div>
  );
};

export default UserData;
