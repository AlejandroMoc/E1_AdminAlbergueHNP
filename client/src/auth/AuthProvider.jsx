// React
import {useContext, createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

// Components
import { API_URL } from "../App";

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  setAccessTokenAndRefreshToken: (
    _accessToken,
    _refreshToken,
  ) => {},
  saveUser: (_userData) => {},
  getRefreshToken: () => {},
  getUser: () => ({}),
  signOut: () => {},
});

const AuthProvider = ({children }) => {
  const [user, setUser] = useState();
  //CESAR parece que el setAccessToken no está funcionando bien porque no agarra nada en accessToken
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isloading, setIsLoading] = useState(true);

  function getAccessToken() {
    return accessToken;
  }

  function saveUser(userData) {
    setAccessTokenAndRefreshToken(
      userData.accessToken,
      userData.refreshToken
    );
    setUser(userData.user);
    setIsAuthenticated(true);
  }

  function setAccessTokenAndRefreshToken( accessToken, refreshToken) {

    // Set tokens
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  
    // Store both tokens in localStorage for persistence
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", JSON.stringify({ refreshToken }));
  }

  function getRefreshToken() {
    if (!!refreshToken) {
      return refreshToken;
    }
    const token = Cookies.get("refreshToken");
    if (token){
      const {refreshToken} = JSON.parse(token);
      setRefreshToken(refreshToken);
      return refreshToken;
    }
    return null;
  }

  async function getNewAccessToken(refreshToken) {
    const token = await requestNewAccessToken(refreshToken);
    if (token) {
      return token;
    }
  }

  function getUser() {
    return user;
  }

  function signOut(){
    // Clear both localStorage and cookies
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    Cookies.remove("refreshToken");
    setAccessToken("");
    setRefreshToken("");
    setUser(undefined);
    setIsAuthenticated(false);
  }

  async function checkAuth() {
    try {
      // First, try to restore accessToken from localStorage
      const storedAccessToken = localStorage.getItem("accessToken");
      if (!!storedAccessToken) {
        const userInfo = await retrieveUserInfo(storedAccessToken);
        setUser(userInfo);
        setAccessToken(storedAccessToken);
        setIsAuthenticated(true);
        setIsLoading(false);
      
      
      // If no accessToken in localStorage, try to get a new one using refreshToken
      } else {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (storedRefreshToken) {
          const refreshTokenData = JSON.parse(storedRefreshToken);
          const refreshToken = refreshTokenData.refreshToken;

          // If no refreshToken, retrieve a new one
          getNewAccessToken(refreshToken)
            .then(async (newToken) => {
              const userInfo = await retrieveUserInfo(newToken);
              setUser(userInfo);
              setAccessToken(newToken);
              setIsAuthenticated(true);
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      }
    } catch {
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    checkAuth();
  },[]);
  
  //el requestNewAccessToken se manda a llamar en la funcion checkAuth, en este mismo archivo
  async function requestNewAccessToken(refreshToken) {
    
    try {
      const response = await fetch(`${API_URL}/refreshtoken`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({refreshToken }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        const accessToken = json.body.accessToken
        return accessToken;
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || response.statusText);

      }
    } catch (error) {
      return null;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        setAccessTokenAndRefreshToken,
        getRefreshToken,
        saveUser,
        getUser,
        signOut,
      }}
    >
      {isloading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

async function retrieveUserInfo(accessToken) {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      return json;
    }
  } catch (error) {
  }
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
