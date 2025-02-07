import React, { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../AppCore/services/LocalStorageService"

// type UserContext = {
//     user:any;
//     login: (data: any) => Promise<void>;
//     logout: () => void;
//   }

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  
  const login = async (data) => {
    setUser(data);
    navigate("/dashboard");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };
  

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};