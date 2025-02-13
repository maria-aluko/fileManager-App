import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import FileUploader from './FileUploader';

const UserData: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]); // Ensure it's an array by default
  const [error, setError] = useState<string | null>(null);

  // Fetch user files
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      
      // Check if token is available
      if (!token) {
        setError('No access token found. Please log in again.');
        return;
      }

      try {
        console.log('Fetching user data with token:', token); // Debugging
        const response = await axios.get('https://unelmacloud.com/api/v1/drive/file-entries', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (Array.isArray(data.data)) {
          setFiles(data.data); 
        } else {
          setError('Failed to load files, no files data available');
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error fetching user files:', error);

        if (axiosError.response && axiosError.response.status === 401) {
          setError('Unauthorized access - Please log in again');
        } else {
          setError('An error occurred while fetching files');
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Your Files</h2>

      {files.length === 0 ? (
        <div>
          <p>No files available. Please upload a file!</p>
          <FileUploader />
        </div>
      ) : (
        <div>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="border-b pb-2">
                <p><strong>File Name:</strong> {file.name}</p>
                <p><strong>File Size:</strong> {file.file_size} bytes</p>
              </li>
            ))}
          </ul>
          <FileUploader />
        </div>
      )}
    </div>
  );
};

export default UserData;
