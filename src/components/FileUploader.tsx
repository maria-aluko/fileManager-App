import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FileUploadProps {
  onUpload: () => void;
}

export default function FileUploader({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null> (null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  async function handleFileUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }
    setStatus("uploading");

    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(
        'https://unelmacloud.com/api/v1/uploads',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus("success");
      setFile(null);;
      alert('File uploaded successfully!');
      onUpload();
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus("error");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="flex justify-center items-center space-y-4 flex-col">
      <div>
        <label 
          htmlFor="file-upload" 
          className="text-white text-xl mt-4 px-6 py-3 bg-sky-600 cursor-pointer inline-block rounded hover:bg-sky-800"
        >
          Choose a file
        </label>
      </div>
      <div>
        <span className="ml-4 text-xl">
            {file ? file.name : 'No file chosen'}
          </span>
      </div>

      <input 
        type="file" 
        onChange={handleFileChange} 
        id="file-upload" 
        className="hidden"
      />

      {file && (
        <div className="flex justify-center items-center flex-col">
            <p>File name: {file.name}</p>
            <p>Size: {file.size}</p>
            <p>Type: {file.type}</p>
        </div>
      )}

      {status === "uploading" ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
          <p className="ml-2 text-xl">Uploading...</p>
        </div>
      ) : (
      file && status === "idle" && (
        <div className="flex justify-center items-center flex-col">
          <button onClick={handleFileUpload} className="text-white text-2xl mx-0 my-8 px-6 py-4 bg-sky-600 p-2 cursor-pointer inline-block rounded hover:bg-sky-800">
          Upload
          </button>
        </div>
        )
      )}
    </div>
  )
};