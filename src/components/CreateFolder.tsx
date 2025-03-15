import axios from "axios";
import { ChangeEvent, useState } from "react";
import MessageModal from "../utils/MessageModal";

interface FolderFormData {
  onFolderCreate: () => void;
}

export default function FolderCreation({ onFolderCreate }: FolderFormData) {
  const [folderName, setFolderName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFolderCreationModalOpen, setIsFolderCreationModalOpen] = useState(false); // Folder creation modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // Confirmation modal state
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
    setErrorMessage(""); // Clear error message when typing
  };

  const handleNewFolderClick = () => {
    setIsFolderCreationModalOpen(true); // Open folder creation modal on button click
  };

  async function handleFolderCreation() {
    if (!folderName) {
      setErrorMessage("Folder name is required!"); // Show error message if folder name is empty
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
      return;
    }
    setIsLoading(true);

    try {
      await axios.post(
        "https://unelmacloud.com/api/v1/folders",
        {
          name: folderName,
          //parentId: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Folder created successfully");
      setFolderName(""); // Clear the input after creating the folder
      onFolderCreate();
      setIsFolderCreationModalOpen(false); // Close folder creation modal after successful creation
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    setIsFolderCreationModalOpen(false); // Close folder creation modal on cancel
    setFolderName(""); // Optionally clear the folder name input
  };

  const handleMessageModalConfirm = () => {
    setIsMessageModalOpen(false); // Close message modal
    handleFolderCreation(); // Proceed to folder creation
  };

  const handleMessageModalCancel = () => {
    setIsMessageModalOpen(false); // Close message modal
    setFolderName(""); // Optionally clear the folder name input
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <button
        onClick={handleNewFolderClick}
        className="simpleButton"
      >
        New Folder
      </button>

      {/* Show the message modal first */}
      {isMessageModalOpen && (
        <MessageModal
          message={`Please enter a name for your folder.`}
          onConfirm={handleMessageModalConfirm}
          onCancel={handleMessageModalCancel}
        />
      )}

      {/* Show folder creation modal */}
      {isFolderCreationModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="text-black bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg text-xl text-purple-700">Create a new folder</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block">Folder Name:</label>
                <input
                  type="text"
                  value={folderName}
                  onChange={handleNameChange}
                  placeholder="Enter folder name"
                  className="border p-2 rounded w-full"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
              </div>
              <button
                type="button"
                disabled={isLoading || !folderName}
                onClick={handleFolderCreation}
                className="simpleButton mx-2"
              >
                {isLoading ? "Creating..." : "Create Folder"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="simpleButton"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
