import api from "./api";

export const getBrokerList = async ({
  loggedInUserId,
  pageNo,
  pageSize,
}: any) => {
  try {
    const response = await api.post("/Admin/GetBrokers", {
      loggedInUserId: loggedInUserId,
      pageNo: pageNo,
      pageSize: pageSize,
    });
    // console.log("BrokerLisr", response.data);
    return response.data;
  } catch (error: any) {
    console.log("errr ", error);
    return {
      status: error.response.data.status,
      error: error.response.data.statusMessage || "An error occurred",
    };
  }
};
