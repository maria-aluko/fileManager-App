and when you open the single page and the "file" is a folder, it should open the folder, showing the files it contains
ChatGPT said:

To handle the case where the "file" is actually a folder, and you want to display the contents of that folder (i.e., the files it contains), you need to modify the logic in your SinglePage component to detect whether the current item is a folder. If it's a folder, you can then fetch and display the files it contains.
Step-by-Step Plan:

    Check if the current item is a folder: When navigating to the single page, check if the item is a folder or a file. If it's a folder, you need to fetch and display its contents.

    Fetch folder contents: If it's a folder, you'll need to fetch the files inside it. This could be done either by passing the folder's ID to the API to get its contents or if you already have the data available, just filter it.

    Display the folder contents: Once you have the files inside the folder, display them on the page. Each file can have its own preview, download, and other actions.

Updated SinglePage Component:

Here's how you can modify the SinglePage component to handle folders and their contents:

```tsx
import { useState, useEffect } from "react";
import { Star, Download, Trash2, Edit, Save } from "lucide-react";
import axios from "axios";

export const SinglePage = () => {
  const [file, setFile] = useState({
    id: "1",
    name: "Example File",
    size: "1.2 MB",
    type: "PDF",
    uploaded: "2021-09-01",
    lastModified: "2021-09-01",
    location: "Documents",
    starred: false,
    isFolder: false, // New flag to indicate whether it's a folder
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(file.name);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [folderContents, setFolderContents] = useState<any[]>([]); // To hold the folder's contents

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setFile({ ...file, name: editName });
    setIsEditing(false);
  };

  const handleOpenClick = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const fetchFolderContents = async (folderId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found.");
      }

      const response = await axios.get(
        `https://unelmacloud.com/api/v1/drive/folder-entries/${folderId}`, // Assuming this is the endpoint to get folder contents
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;
      setFolderContents(data);
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
  };

  useEffect(() => {
    // If the file is a folder, fetch its contents
    if (file.isFolder) {
      fetchFolderContents(file.id);
    }
  }, [file]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-grow relative flex-col md:flex-row">
        {/* Main Content */}
        <div className="flex-grow flex flex-col md:flex-row p-4 gap-4">
          {/* File Viewer */}
          <div className="md:w-3/5 w-full flex flex-col items-center justify-center border rounded-lg bg-gray-100 p-4 shadow-lg">
            <div className="relative w-full h-72 md:h-96 flex items-center justify-center bg-white border rounded-lg">
              {/* Placeholder for File Preview */}
              {file.isFolder ? (
                <div className="text-center p-8">
                  <h3 className="text-xl font-semibold">Folder Contents</h3>
                  <ul className="space-y-4 mt-4">
                    {folderContents.length > 0 ? (
                      folderContents.map((item) => (
                        <li key={item.id}>
                          <div className="flex items-center space-x-2 text-xl">
                            <strong>{item.name}</strong>
                            <button
                              onClick={() => {
                                setFile({
                                  ...item,
                                  isFolder: item.type === "folder",
                                }); // Set the folder or file
                              }}
                              className="cursor-pointer text-blue-500"
                            >
                              Open
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No files in this folder.</p>
                    )}
                  </ul>
                </div>
              ) : (
                <img
                  src="/placeholder.png"
                  alt="File preview"
                  className="max-w-full max-h-full object-contain"
                />
              )}

              {/* Star for Favorites */}
              <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow cursor-pointer">
                <Star className="text-yellow-400" />
              </button>

              {/* Open in Editor */}
              {!file.isFolder && (
                <button
                  onClick={handleOpenClick} // Trigger modal open
                  className="absolute bottom-2 left-2 p-2 bg-white rounded shadow cursor-pointer"
                >
                  Open
                </button>
              )}
            </div>
          </div>

          {/* File Information */}
          <div className="md:w-2/5 w-full p-4 space-y-4 border rounded-lg bg-white shadow-lg">
            {/* File Name (Editable) */}
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)} // Hier wird der Name aktualisiert
                    className="border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xl font-semibold w-full"
                  />
                  <button
                    onClick={handleSaveClick}
                    className="p-2 bg-green-500 text-white rounded shadow cursor-pointer"
                    title="Save filename"
                  >
                    <Save />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xl font-semibold underline">
                    {file.name}
                  </span>
                  <button
                    onClick={handleEditClick}
                    className="p-2 bg-gray-200 rounded shadow cursor-pointer"
                    title="Edit filename"
                  >
                    <Edit className="text-gray-500" />
                  </button>
                </>
              )}
            </div>

            {/* File Details */}
            <p>
              <strong>Date Added:</strong> {file.uploaded}
            </p>
            <p>
              <strong>File Size:</strong> {file.size}
            </p>
            <p>
              <strong>Type:</strong> {file.type}
            </p>
            <p>
              <strong>Last Modified:</strong> {file.lastModified}
            </p>
            <p>
              <strong>Storage Location:</strong> {file.location}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded shadow cursor-pointer">
                <Download className="mr-2" /> Download
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded shadow cursor-pointer">
                <Trash2 className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for File Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative w-3/4 h-3/4 bg-white p-4 rounded-lg shadow-lg">
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full"
            >
              X
            </button>

            {/* Preview Content */}
            {file.type === "PDF" ? (
              <iframe
                src="/path/to/your/pdf-preview.pdf" // Replace with actual PDF file URL
                className="w-full h-full"
                title="File Preview"
              />
            ) : (
              <img
                src="/path/to/your/image-file.jpg" // Replace with actual image file URL
                alt="File preview"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

Key Updates:

    Folder Handling:
        I added a new field isFolder to the file object to indicate whether the item is a folder.
        If the file is a folder, the component fetches and displays its contents by calling fetchFolderContents.
        Inside the folder, you can navigate to individual files or subfolders by clicking on the "Open" button next to them, which will update the file state.

    Folder Contents Rendering:
        When a folder is opened, it displays a list of files and folders inside the folder.

the filename can be edited but is not saved when I click on save button
ChatGPT said:

You're right! The issue is that while you update editName in state, you're not actually using it to update file.name when clicking the Save button. Instead, you're directly modifying file.name inside the input field, which doesn't persist after saving.
Fix:

    Update editName when the input changes, instead of updating file.name directly.
    Ensure handleSaveClick properly updates the file name in state.

Fixed Code:

const handleEditClick = () => {
setIsEditing(true);
setEditName(file.name); // Set the current name in the input field
};

const handleSaveClick = () => {
setFile({ ...file, name: editName }); // Update file state with new name
setIsEditing(false);
};

Fixed Input Field Code:

```tsx
<input
  type="text"
  value={editName} // Controlled by editName state
  onChange={(e) => setEditName(e.target.value)} // Update editName on change
  className="border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xl font-semibold w-full"
/>
```

Why This Works:

    When you click Edit, it sets editName to the current file.name.
    When typing, it only updates editName, leaving file.name untouched.
    When clicking Save, it updates file.name with editName, ensuring the new name is actually saved.

## error

it doesnt change the state of filename
when opening the singlepage it shows the example file name
