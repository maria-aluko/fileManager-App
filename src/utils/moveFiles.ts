import axios from "axios";

const BASE_URL = "https://unelmacloud.com/api/v1/drive";

/**
 * Move files to another folder
 * @param fileIds - Array of file IDs to move
 * @param destinationFolderId - The ID of the target folder
 * @returns Promise resolving to the API response
 */
export const moveFiles = async (fileIds: string[], destinationFolderId: string) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/file-entries/move`,
      {
        entry_ids: fileIds,
        destination: destinationFolderId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error moving files:", error);
    throw error;
  }
};
