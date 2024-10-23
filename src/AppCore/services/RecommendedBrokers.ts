import api from "./api";
export const imagesBucketPath =
  "https://broker2023.s3.ap-south-1.amazonaws.com/";
export const updateBrokerList = async (formData: any) => {
  try {
    const response = await api.post("/Admin/AddRecommendedBroker", {...formData});
    console.log("BrokerLisr", response.data);
    return response.data;
  } catch (error: any) {
    console.log("errr ", error);
    return {
      status: error.response.data.status,
      error: error.response.data.statusMessage || "An error occurred",
    };
  }
};

export const getRecommendedBrokerList = async ({
  loggedInUserId,

  pageNo,
  pageSize,
}: any) => {
  try {
    const response = await api.post("/Admin/GetAllRecommendedBrokers", {
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

export const updateRecomendedBroker = async ({
  recommendedBrokerId,
  loggedInUserId,
  userId,
  countryId,
  stateId,
  cityId,
  fromDate,
  toDate,
  brokerageAmount,
}: any) => {
  try {
    const response = await api.put("/Admin/UpdateRecommendedBroker", {
      recommendedBrokerId: recommendedBrokerId,
      loggedInUserId: loggedInUserId,
      userId: userId,
      countryId: countryId,
      stateId: stateId,
      cityId: cityId,
      fromDate: fromDate,
      toDate: toDate,
      brokerageAmount: brokerageAmount,
    });
    console.log("BrokerLisr", response.data);
    return response.data;
  } catch (error: any) {
    console.log("errr ", error);
    return {
      status: error.response.data.status,
      error: error.response.data.statusMessage || "An error occurred",
    };
  }
};

export const deleteRecomendedBrokerList = async ({
  recommendedBrokerId,
  loggedInUserId,
  userId,
}: any) => {
  try {
    const response = await api.delete("/Admin/DeleteRecommendedBroker", {
      data: {
        recommendedBrokerId: recommendedBrokerId,
        loggedInUserId: loggedInUserId,
        userId: userId,
      },
    });
    console.log("BrokerLisr", response.data);
    return response.data;
  } catch (error: any) {
    console.log("errr ", error);
    return {
      status: error.response.data.status,
      error: error.response.data.statusMessage || "An error occurred",
    };
  }
};
