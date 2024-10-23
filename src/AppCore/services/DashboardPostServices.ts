import { AddDashboardPostRequest, DeleteDashboardPostRequest, ListDashboardPostRequest, SearchRequest } from "../types/DashboardPost";
import api from "./api";

  export const searchPost = async (endpoint: string, request: SearchRequest) => {
    try {
      const response = await api.post(endpoint, {...request});
      return response.data;
    } catch (error: any) {
      console.log("errr ", error);
      return {
        status: error.response.data.status,
        error: error.response.data.statusMessage || "An error occurred",
      };
    }
  };


  export const listDashboardPost = async (endpoint: string, request: ListDashboardPostRequest) => {
    try {
      const response = await api.post(`${endpoint}/List`, request);
      return response.data;
    } catch (error: any) {
      console.log("errr ", error);
      return {
        status: error.response.data.status,
        error: error.response.data.statusMessage || "An error occurred",
      };
    }
  };

  // export const getPostByID = async () => {
  //   try {
  //     const response = await api.post(`Car/Post/PostDetail`, {postId: 16});
  //     return response.data;
  //   } catch (error: any) {
  //     console.log("errr ", error);
  //     return {
  //       status: error.response.data.status,
  //       error: error.response.data.statusMessage || "An error occurred",
  //     };
  //   }
  // };
  export const getPostByID = async () => {
    try {
      const response = await api.post(`Dashboard/Brokers/Count`);
      return response.data;
    } catch (error: any) {
      console.log("errr ", error);
      return {
        status: error.response.data.status,
        error: error.response.data.statusMessage || "An error occurred",
      };
    }
  };

  export const addDashboardRealEstate = async (endpoint: string, request: AddDashboardPostRequest) => {
    try {
      const response = await api.post(`${endpoint}/Add`, request);
      return response.data;
    } catch (error: any) {
      console.log("errr ", error);
      return {
        status: error.response.data.status,
        error: error.response.data.statusMessage || "An error occurred",
      };
    }
  };

  export const deleteDashboardPost = async (endpoint: string, userId: number, postId: number, categoryId: number) => {
    try {
      const response = await api.delete(`${endpoint}/Delete`, { data: { userId, postId, categoryId}});
      return response.data;
    } catch (error: any) {
      console.log("errr ", error);
      return {
        status: error.response.data.status,
        error: error.response.data.statusMessage || "An error occurred",
      };
    }
  };
