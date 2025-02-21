import axios from "axios";
import delete_button from "../assets/delete_button.svg";
import { useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import MessageModal from "../utils/messageModal";

interface DeleteProp {
  fileId: number;
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
      setIsModalOpen(false);
    }
  }

  // Function to handle when the user cancels the deletion
  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-xl p-3 bg-grey-200 cursor-pointer inline-block rounded hover:bg-red-200 hover:border-red-800 hover:border-1"
        disabled={isDeleting}
        >
        {isDeleting ? (
          <LoadingSpinner /> 
        ) : (
          <img src={delete_button} alt="delete" className="w-5 h-5" />
        )}
      </button>

      {isModalOpen && (
        <MessageModal
          message="Are you sure you want to delete this file?"
          onConfirm={handleDelete} 
          onCancel={cancelDelete}
        />
      )}
    </div>
  )
}
