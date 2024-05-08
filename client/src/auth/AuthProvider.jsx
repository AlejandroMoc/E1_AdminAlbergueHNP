import React, { useContext, createContext, useState, useEffect } from "react";
// import type {AuthResponse} from "../types/types"

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken:()=>{},
  saveUser: (userData) => {},
});

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  function getAccessToken() {
    return accessToken;
  }

  function saveUser(userData) {
    setAccessToken(userData.body.accessToken);
    setRefreshToken(userData.body.refreshToken);
    localStorage.setItem("token", JSON.stringify(userData.body.refreshToken));
    setIsAuthenticated(true);
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setRefreshToken(JSON.parse(storedToken));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;