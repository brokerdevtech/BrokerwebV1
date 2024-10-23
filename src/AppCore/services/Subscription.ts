import api from "./api";

export const getSubscriptionUserList = async ({
  loggedInUserId,
  pageNo,
  pageSize,
}: any) => {
  try {
    const response = await api.post(
      "/Admin/Subscription/ActiveSubscriptionUser",
      {
        loggedInUserId: loggedInUserId,
        pageNo: pageNo,
        pageSize: pageSize,
      }
    );
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
export const getNonSubscriptionUserList = async ({
  loggedInUserId,
  pageNo,
  pageSize,
}: any) => {
  try {
    const response = await api.post("/Admin/Subscription/NonSubscriptionUser", {
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

export const ActivateSubscriptionUser = async ({
  userId,
  fromDate,
  toDate,
  amount,
}: any) => {
  try {
    const response = await api.post("/Admin/Subscription/Activate", {
      userId: userId,
      fromDate: fromDate,
      toDate: toDate,
      amount: amount,
      currency: "INR",
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
export const DeActivateSubscriptionUser = async ({ userId }: any) => {
  try {
    const response = await api.post("/Admin/Subscription/Deactivate", {
      userId: userId,
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
