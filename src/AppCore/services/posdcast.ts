import api from "./api";

export const uploadPodcast = async ({
  userId,
  title,
  description,
  mediaBlob,
  mediaThumbnail,
  mediaType,
}: any) => {
  try {
    const response = await api.post("/Podcast/Add", {
      userId: userId,
      title: title,
      description: description,
      mediaBlob: mediaBlob,
      mediaThumbnail: mediaThumbnail,
      mediaType: mediaType,
    });
    return response.data;
  } catch (error: any) {
    console.log("errr ", error);
    return {
      status: error.response.data.status,
      error: error.response.data.statusMessage || "An error occurred",
    };
  }
};

export const deletePodcast = async ({ userId, podcastId }: any) => {
  try {
    const response = await api.post("/Podcast/Delete", {
      userId: userId,
      podcastId: podcastId,
    });
    return response.data;
  } catch (error: any) {
    console.log("errr ", error);
    return {
      status: error.response.data.status,
      error: error.response.data.statusMessage || "An error occurred",
    };
  }
};
