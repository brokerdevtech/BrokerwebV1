import api from "./api";

export const getPodcastList = async ({
  userId,
  pageNo,
  pageSize,
}: any) => {
  try {
    const response = await api.post("/Podcast/List", {
      userId,
      pageNo,
      pageSize,
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
