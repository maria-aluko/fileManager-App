import axios from "axios";
import { ChangeEvent, useState } from "react";
import MessageModal from "../utils/MessageModal";

interface FolderFormData {
  onFolderCreate: () => void;
}

export default function FolderCreation({ onFolderCreate }: FolderFormData) {
  const [folderName, setFolderName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
    setErrorMessage(""); // Clear error message when typing
  };

  const handleNewFolderClick = () => {
    setIsModalOpen(true); // Open modal on button click
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
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false); // Close modal after folder creation
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false); // Close modal on cancel
    setFolderName(""); // Optionally clear the folder name input
  };

  return (
    <div className="flex justify-center items-center space-y-4 flex-col">
      <button
        onClick={handleNewFolderClick}
        className="text-white text-xl mx-0 my-8 px-6 py-2 bg-sky-600 p-2 cursor-pointer inline-block rounded hover:bg-sky-800"
      >
        New Folder
      </button>

      {isModalOpen && (
        <MessageModal
          message={`Please enter a name for your folder.`}
          onConfirm={handleFolderCreation} // Pass the function reference
          onCancel={handleCancel}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg">Create a new folder</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-lg">Folder Name:</label>
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
                className="text-white text-xl mx-2 my-6 px-4 py-2 bg-sky-600 p-2 cursor-pointer inline-block rounded hover:bg-sky-800"
              >
                {isLoading ? "Creating..." : "Create Folder"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-white text-xl px-6 py-2 bg-gray-600 p-2 cursor-pointer inline-block rounded hover:bg-gray-800"
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