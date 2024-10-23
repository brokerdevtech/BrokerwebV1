import api from './api'; // Your Axios instance
import UserRegistration from '../types/userRegistration'

export const loginUtilitise = async (email: string, password: string) => {
    try {
  
      // Make a POST request to your login API endpoint
      const response = await api.post('/Users/login', {'userName': email, "Password":password });
   //   const { accessToken, refreshToken } = response.data;
   return response.data;
    } catch (error:any) {
      console.log("errr ", error)
      return { status:error.response.data.status, error: error.response.data.statusMessage || 'An error occurred' };
    }
  };

  export const signup = async (User:UserRegistration) => {
    try {
      console.log("UserRegistration",User);
  
      // Make a POST request to your login API endpoint
      const response = await api.post('Users/signup',User);
      console.log('UserRegistrationresponse',response);
      return response.data;
    } catch (error) {
      
      // if (error.response && error.response.status === 422) {
      //   // Handle 422 error
      //   console.log(error.response.data);
      //   console.log(error.response.data.statusMessage);
      //   console.log('Unprocessable Entity - Validation Error:', error.response.data);
      // }
      console.log('UserRegistrationresponse',error);
      return { status:false, error: 'An error occurred' };
    }
  };

  export const getCountryList=async () => {

    try {
  
      // Make a POST request to your login API endpoint
      const response = await api.get('Registration/CountryList');
      
      
      return response.data;
    } catch (error) {
      console.log('errorapi');
      console.log(error);
      return { success: false, error: 'An error occurred' };
    }
  }

  export const getStateList=async (countryId:any) => {

    try {
      const jsonData = {
        countryId: countryId,
       
      };
      // Make a POST request to your login API endpoint
      const response = await api.post('Registration/StateList',jsonData);
      
      
      return response.data;
    } catch (error) {
      console.log('errorapi');
      console.log(error);
      return { success: false, error: 'An error occurred' };
    }
  }
  
  export const getCityList=async (stateId:any) => {

    try {
      const jsonData = {
        stateId: stateId,
       
      };
      // Make a POST request to your login API endpoint
      const response = await api.post('Registration/CityList',jsonData);
      
      
      return response.data;
    } catch (error) {
      console.log('errorapi');
      console.log(error);
      return { success: false, error: 'An error occurred' };
    }
  }

