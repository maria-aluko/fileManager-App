import axios from "axios";
import deleteIcon from "../assets/delete.svg";
import { useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import MessageModal from "../utils/messageModal";

interface DeleteProp {
  fileId: string;
  onDelete: () => void; // Callback function to trigger re-fetch of files
}

export const FileDeleter: React.FC<DeleteProp> = ({fileId, onDelete}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }
    setIsModalOpen(false);
    setIsDeleting(true);

    try {
      await axios.delete(`https://unelmacloud.com/api/v1/file-entries/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          entryIds: [fileId.toString()],
          deleteForever: false,
        },
      });

      // Trigger re-fetch of files in the parent component
      onDelete();
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      // Stop the spinner after the operation is finished
      setIsDeleting(false);
      
    }
    setIsModalOpen(false);
  }

  // Function to handle when the user cancels the deletion
  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-xl p-3 cursor-pointer rounded star-button"
        disabled={isDeleting}
        >
        {isDeleting ? (
          <LoadingSpinner /> 
        ) : (
          <img src={deleteIcon} alt="delete" className="w-5 h-5" />
        )}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
        <MessageModal
          message="Are you sure you want to delete this file?"
          onConfirm={handleDelete} 
          onCancel={cancelDelete}
        />
        </div>
      )}
    </div>
  )
}
