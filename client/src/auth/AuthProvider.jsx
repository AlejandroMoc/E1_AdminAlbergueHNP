import React, { useContext, createContext, useState, useEffect } from "react";
// import { r } from "tar";
// import type {AuthResponse, AccessTokenResponse, User} from "../types/types"

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  saveUser: (userData) => {},
  getRefreshToken: () => {},
  getUser: () => ({}),
  signOut: () => {},
});

const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState<User>();
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isloading, setIsLoading] = useState(true);

  function getAccessToken() {
    return accessToken;
  }

  useEffect(()=>{
    checkAuth();
  },[]);

  //el requestNewAccessToken se manda a llamar en la funcion checkAuth, en este mismo archivo
  async function requestNewAccessToken(refreshToken) {
    console.log("Sí está sacando aqui un refreshToken");
    console.log("Hasta aquí está bien");
    console.log(refreshToken);
    try {
      
      //CESAR, no se si es aqui donde no lo agarra bien
      const response = await fetch("http://localhost:8000/refreshtoken", {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
  
      console.log("MIRAMEAAAA");
      console.log(response)

      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        //TODO checar si es .body o sin el .body
        return json.accessToken;
      } else {
        const errorResponse = await response.json();
        // CHECAR QUE SE VA DIRECTO A AQUI Y NO SE POR QUE
        console.log("Luego se va aqui, lo que quiere decir que no está regresando una respuesta ok");
        console.log("33333333333");
        console.log("Error Response:", errorResponse);
        console.log("Response Status Text:", response.statusText);
        throw new Error(errorResponse.error || response.statusText);

      }
    } catch (error) {
      // CHECAR AQUI
      console.log("11111111");
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


  async function checkAuth() {
    try {
      if (!!accessToken) {
        //existe access token
        const userInfo = await retrieveUserInfo(accessToken);
        setUser(userInfo);
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        //no existe access token
        const token = localStorage.getItem("token");
        if (token) {
          console.log("useEffect: token", token);
          const refreshToken = JSON.parse(token).refreshToken;
          //pedir nuevo access token
          getNewAccessToken(refreshToken)
            .then(async (newToken) => {
              const userInfo = await retrieveUserInfo(newToken);
              setUser(userInfo);
              setAccessToken(newToken);
              setIsAuthenticated(true);
              setIsLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  }

  function signOut(){
    setIsAuthenticated(false);
    setAccessToken("");
    setUser(undefined);
    localStorage.removeItem("token");
  }
  
  function saveSessionInfo(userInfo, accessToken,refreshToken){
    setAccessToken(accessToken);
    localStorage.setItem("token", JSON.stringify(refreshToken));
    setIsAuthenticated(true);
    setUser(userInfo);
  }


  function getRefreshToken() {
    // if (!!refreshToken) {
    //   return refreshToken;
    // }
    const token = localStorage.getItem("token");
    if (token){
      // const {refreshToken} = JSON.parse(token);
      const {refreshToken} = JSON.parse(token);
      console.log("WIIIIII");
      console.log({refreshToken});
      setRefreshToken(refreshToken);
      return refreshToken;
    }
    return null;
  }

  function saveUser(userData) {
    saveSessionInfo(
      // userData.user, 
      userData.accessToken,
      userData.refreshToken
    );
    setUser(userData.user);
    setIsAuthenticated(true);
  }

  function getUser(userData) {
    return user;
  }

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     console.log("digame");
  //     console.log(storedToken);
  //     setRefreshToken(JSON.parse(storedToken));
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;