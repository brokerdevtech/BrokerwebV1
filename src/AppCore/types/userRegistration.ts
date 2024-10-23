interface UserRegistration {
    email: string;
    contactNo: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    countryId: number;
    stateId: number;
    cityId: number;
    deviceId: string;
    isOrg: boolean;
  }
  
  export default UserRegistration;