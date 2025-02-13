import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react"

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState<File | null> (null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

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
      setFile(null);
      alert('File uploaded successfully!'); 
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label 
          htmlFor="file-upload" 
          className="text-2xl px-6 py-4 bg-sky-600 cursor-pointer inline-block rounded hover:bg-sky-800"
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
        <div>
            <p>File name: {file.name}</p>
            <p>Size: {file.size}</p>
            <p>Type: {file.type}</p>
        </div>
      )}
      {file && status !== "uploading" && 
        <button onClick={handleFileUpload} className="text-2xl mx-0 my-8 px-6 py-4 bg-sky-600 p-2 cursor-pointer inline-block rounded hover:bg-sky-800">
        Upload
        </button>
      } 
    </div>
  )
};