import React from "react";

interface FileViewerProps {
  fileUrl: string;
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <button onClick={onClose} className="text-red-500">
          Close
        </button>
        <iframe
          src={fileUrl}
          className="w-full h-96 mt-4"
          title="File Viewer"
        ></iframe>
      </div>
    </div>
  );
};

export default FileViewer;
