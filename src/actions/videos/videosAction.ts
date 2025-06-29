"use server";
export const getAllVideos = async (page: number, limit: number, searchQuery = "") => {
  try {
    const response = await fetch(`/api/videos?page=${page}&limit=${limit}&search=${searchQuery}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { videos: [], total: 0 };
  }
};

export const addVideo = async (videoData: any) => {
  try {
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add video");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding video:", error);
    throw error;
  }
}

export const updateVideo = async (videoId: string, videoData: any) => {
  try {
    const response = await fetch(`/api/videos/${videoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update video");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
}
export const deleteVideo = async (videoId: string) => {
  try {
    const response = await fetch(`/api/videos/${videoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete video");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
}