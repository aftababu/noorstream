"use server";


export const getAllCollections = async () => {
  try {
    const response = await fetch("/api/collections", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch collections");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
}

export const createCollection = async (collectionData: any) => {
  try {
    const response = await fetch("/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collectionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add collection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
}

export const updateCollection = async (collectionId: string, collectionData: any) => {
  try {
    const response = await fetch(`/api/collections/${collectionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collectionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update collection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
}

export const deleteCollection = async (collectionId: string) => {
  try {
    const response = await fetch(`/api/collections/${collectionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete collection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
}