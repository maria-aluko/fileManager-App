import axios from "axios";
import { ChangeEvent, useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import MessageModal from "../utils/MessageModal";

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
    <div className="flex justify-center items-center flex-col">
      <label
        htmlFor="file-upload"
        className="simpleButton"
      >
        Choose a file
      </label>
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
