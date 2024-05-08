import React, { useContext, createContext, useState, useEffect } from "react";
// import { r } from "tar";
// import type {AuthResponse, AccessTokenResponse, User} from "../types/types"

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  saveUser: (userData) => {},
  getRefreshToken: () => {},
  getUser: () => ({}),
});

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  // const [user, setUser] = useState<User>();
  const [user, setUser] = useState();
  const [refreshToken, setRefreshToken] = useState("");

  useEffect(()=>{
    checkAuth();
  },[]);

  async function requestNewAccessToken(refreshToken){
    try {
      const response = await fetch ("http://localhost:8000/refresh-token",{
        method: "POST",
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.ok){
        // const json = await response.json() as AccessTokenResponse;
        const json = await response.json();
        if (json.error){
          throw new Error(json.error);
        }
        return json.body.accessToken;
      }else{
        throw new Error(response.statusText);
      }

    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUserInfo(accessToken){
    try {
      const response = await fetch ("http://localhost:8000/user",{
        method: "GET",
        headers: {
          'Content-type': "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok){
        // const json = await response.json() as AccessTokenResponse;
        const json = await response.json();
        if (json.error){
          throw new Error(json.error);
        }
        return json.body;
      }else{
        throw new Error(response.statusText);
      }

    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function checkAuth(){
    if(accessToken){
      //el usuario esta autenticado
    }else{
      //el usuario no esta autenticado
      const token = getRefreshToken();
      if (token){
        const newAccessToken = await requestNewAccessToken(token);
        if (newAccessToken){
          const userInfo = await getUserInfo(newAccessToken);
          if (userInfo){
            saveSessionInfo(userInfo,newAccessToken,token);
          }
        }
      }
    }
  }

  function saveSessionInfo(userInfo, accessToken,refreshToken){
    setAccessToken(accessToken);
    localStorage.setItem("token", JSON.stringify(refreshToken));
    setIsAuthenticated(true);
    setUser(userInfo);
  }

  function getAccessToken() {
    return accessToken;
  }

  function getRefreshToken() {
    const tokenData = localStorage.getItem("token");
    if (tokenData){
      const token = JSON.parse(tokenData);
      return token;
    }
    return null;
  }

  function saveUser(userData) {
    saveSessionInfo(userData.user, userData.accessToken,userData.refreshToken);
  }

  function getUser(userData) {
    return user;
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setRefreshToken(JSON.parse(storedToken));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;