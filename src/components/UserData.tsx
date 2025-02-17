import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import FileUploader from './FileUploader';
import { FileDeleter } from './FileDeleter';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-solid rounded-full animate-spin"></div>
  </div>
);

const UserData: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]); // Ensure it's an array by default
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // fetch user files
  const fetchUserData = async () => {
    setIsLoading(true);
    // get the token from local storage
    const token = localStorage.getItem('access_token');
    
    // if no token, set error
    if (!token) {
      setError('No access token found. Please log in again.');
      setIsLoading(false); 
      return;
    }
    // if there, is a token, fetch
    try {
      console.log('Fetching user data with token:', token); // debugging
      const response = await axios.get('https://unelmacloud.com/api/v1/drive/file-entries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      // data should come as an array 
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
    } finally {
      setIsLoading(false); 
    }
  };
  useEffect(() => {
    // call the function  
    fetchUserData();
  }, []);

  const handleFileDeleted = () => {
    fetchUserData(); // Re-fetch files after deletion
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
          <p>No files available. Please upload a file!</p>
          <FileUploader />
        </div>
      ) : (
        <div className='space-y-4'>
          <div>
            <ul className="flex items-center flex-wrap flex-row space-x-2 space-y-2">
              {files.map((file) => (
                <div className=' w-75 h-50 bg-gray-200 m-4 p-6 rounded-lg'>
                  <li key={file.id} className="border-b pb-2">
                    <p className='text-xl'><strong>File Name:</strong> {file.name}</p>
                    <p><strong>File Size:</strong> {(file.file_size/1000000).toFixed(3)} MB</p>
                    <p><strong>File Type:</strong> {file.type}</p>
                    <p><strong>File ID:</strong> {file.id}</p>
                    {/*<p className="w-50 h-50"><strong>Thumbnail:</strong> How to get this?{file.thumbnail}</p>*/}                 <p><strong>Uploaded on:</strong> {file.created_at.slice(0, 10)}</p>
                    <FileDeleter fileId={file.id} onDelete={handleFileDeleted}/>
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <FileUploader />
        </div>
      )}
    </div>
  );
};

export default UserData;
