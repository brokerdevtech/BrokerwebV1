import api from './api'; // Your Axios instance

export const GetKycUserList = async (userid: number, pageno: number, pagesize:number) => {
    try {
  
      // Make a POST request to your login API endpoint
      const response = await api.post('/Admin/KYCUserList', {'userid': userid, "pageno":pageno, "pagesize":pagesize  });
   //   const { accessToken, refreshToken } = response.data;
   return response.data;
    } catch (error:any) {
      console.log("errr ", error)
      return { status:error.response.data.status, error: error.response.data.statusMessage || 'An error occurred' };
    }
  };

  export const updateUserKyc = async (approverUserId:number, userid: number, status: number, description:number) => {
    try {
  
      // Make a POST request to your login API endpoint
      const response = await api.post('/Admin/UpdateUserKyc', {'approverUserId': approverUserId, 'userid': userid, "kycStatusId":status, "kycStatusDescription":description  });
   //   const { accessToken, refreshToken } = response.data;
   return response.data;
    } catch (error:any) {
      console.log("errr ", error)
      return { status:error.response.data.status, error: error.response.data.statusMessage || 'An error occurred' };
    }
  };