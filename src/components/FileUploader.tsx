import axios from "axios";
import { ChangeEvent, useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import MessageModal from "../utils/messageModal";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FileUploadProps {
  onUpload: () => void;
}

export default function FileUploader({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setIsModalOpen(true);
    }
  }

  async function handleFileUpload() {
    if (!file) return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
      return;
    }
    setIsModalOpen(false);
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("https://unelmacloud.com/api/v1/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus("success");
      setFile(null);
      alert("File uploaded successfully!");
      onUpload();
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("error");
    } finally {
      setStatus("idle");
    }
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center space-y-4 flex-col">
      <div>
        <label
          htmlFor="file-upload"
          className="text-white text-xl mt-4 px-6 py-2 bg-sky-600 cursor-pointer inline-block rounded hover:bg-sky-800"
        >
          Choose a file
        </label>
      </div>

      <input
        type="file"
        onChange={handleFileChange}
        id="file-upload"
        className="hidden"
      />

      {isModalOpen && file && (
        <MessageModal
          message={`Are you sure you want to upload the file "${file.name}"?`}
          onConfirm={handleFileUpload}
          onCancel={handleCancel}
        />
      )}

      {status === "uploading" && (
        <div className="flex justify-center items-center mt-4">
          <LoadingSpinner />
          <p className="ml-2 text-xl">Uploading...</p>
        </div>
      )}
    </div>
  );
}
