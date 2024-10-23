import api from "./api";

export const getCountryList = async () => {
  try {
    // Make a POST request to your login API endpoint
    const response = await api.get("Registration/CountryList");

    return response.data;
  } catch (error: any) {
    console.log("errorapi");
    console.log(error);
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

export const getStateList = async (countryId: any) => {
  try {
    const jsonData = {
      countryId: countryId,
    };
    // Make a POST request to your login API endpoint
    const response = await api.post("Registration/StateList", jsonData);

    return response.data;
  } catch (error: any) {
    console.log("errorapi");
    console.log(error);
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

export const getCityList = async (stateId: any) => {
  try {
    const jsonData = {
      stateId: stateId,
    };
    // Make a POST request to your login API endpoint
    const response = await api.post("Registration/CityList", jsonData);

    return response.data;
  } catch (error: any) {
    console.log("errorapi");
    console.log(error);
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};
