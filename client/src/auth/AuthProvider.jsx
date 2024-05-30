import React, {useContext, createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
// import {r } from "tar";
// import type {AuthResponse, AccessTokenResponse, User} from "../types/types"

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  setAccessTokenAndRefreshToken: (
    _accessToken,
    _refreshToken,
  ) => {},
  saveUser: (userData) => {},
  getRefreshToken: () => {},
  getUser: () => ({}),
  signOut: () => {},
});

const AuthProvider = ({children }) => {
  // const [user, setUser] = useState<User>();
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
    // saveSessionInfo(
      // userData.user, 
      userData.accessToken,
      userData.refreshToken
    );
    setUser(userData.user);
    setIsAuthenticated(true);
  }

  function setAccessTokenAndRefreshToken( accessToken, refreshToken) {
    //console.log("setAccessTokenAndRefreshToken", accessToken, refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    Cookies.set("refreshToken", refreshToken);
    //localStorage.setItem("token", JSON.stringify({refreshToken }));
  }

  function getRefreshToken() {
    if (!!refreshToken) {
      return refreshToken;
    }
    //const token = localStorage.getItem("token");
    const token = Cookies.get("refreshToken");
    if (token){
      const {refreshToken} = JSON.parse(token);
      //console.log("WIIIIII");
      //console.log({refreshToken});
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
    // console.log("MADRE MIAAAAA ESTO YA FUNCIONABAAAA");
    // console.log(user);
    return user;
  }

  function signOut(){
    //localStorage.removeItem("token");
    Cookies.remove("refreshToken");
    setAccessToken("");
    setRefreshToken("");
    setUser(undefined);
    setIsAuthenticated(false);
  }

  async function checkAuth() {
    try {
      //console.log("El accesstoken que no quiere agarrar es", accessToken);
      //Si existe el accessToken, retribuirlo
      if (!!accessToken) {
        const userInfo = await retrieveUserInfo(accessToken);
        //console.log('CHECA1');
        //console.log(user);
        setUser(userInfo);
        //console.log(user);
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        //CESAR AQUI se está yendo el código y no debería
        // const token = localStorage.getItem("token");
        const token = Cookies.get("refreshToken");
        if (token) {
          //console.log("useEffect: token", token);
          // const refreshToken = JSON.parse(token).refreshToken;
          const refreshToken = JSON.parse(token).refreshToken;
          //Si no existe el access token, voy a pedir un nuevo access token
          //console.log("Voy a pedir un nuevo token");
          getNewAccessToken(refreshToken)
            .then(async (newToken) => {
              //console.log("El nuevo token es",newToken);
              const userInfo = await retrieveUserInfo(newToken);
              //console.log('CHECA2');
              //console.log(userInfo);
              //console.log('Este es userInfo:', userInfo);
              setUser(userInfo);
              setAccessToken(newToken);
              setIsAuthenticated(true);
              setIsLoading(false);
            })
            .catch((error) => {
              //console.log(error);
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      //console.log("quesera",error);
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    checkAuth();
    //console.log('Se llamó a checkAUTH');
  },[]);
  
  //el requestNewAccessToken se manda a llamar en la funcion checkAuth, en este mismo archivo
  async function requestNewAccessToken(refreshToken) {
    //console.log("Sí está sacando aqui un refreshToken");
    //console.log("Hasta aquí está bien");
    //console.log(refreshToken);
    try {
      
      const response = await fetch("http://10.50.91.88:8008/refreshtoken", {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({refreshToken }),
      });
  
      //console.log("MIRAMEAAAA");
      //console.log(response)

      if (response.ok) {
        //console.log('OK?');
        const json = await response.json();
        //console.log("OKI");
        //console.log(json)
        //console.log("OKI");
        if (json.error) {
          throw new Error(json.error);
        }
        //TODO checar si es .body o sin el .body
        const accessToken = json.body.accessToken
        //console.log("Dime el access token A", accessToken);
        return accessToken;
      } else {
        const errorResponse = await response.json();
        // CHECAR QUE SE VA DIRECTO A AQUI Y NO SE POR QUE
        //console.log("Luego se va aqui, lo que quiere decir que no está regresando una respuesta ok");
        //console.log("33333333333");
        //console.log("Error Response:", errorResponse);
        //console.log("Response Status Text:", response.statusText);
        throw new Error(errorResponse.error || response.statusText);

      }
    } catch (error) {
      // CHECAR AQUI
      //console.log("11111111",error);
      return null;
    }
  }

  //Parece que esta función ni se usa
  async function getUserInfo(accessToken){
    try {
      const response = await fetch ("http://10.50.91.88:8008/user",{
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
          //console.log("LOREM IPSUM B")
          throw new Error(json.error);
        }
        //console.log("LOREM IPSUM 2");
        const dime =json.body;
        //console.log(dime);
        return json.body;
      }else{
        throw new Error(response.statusText);
      }

    } catch (error) {
      //console.log(error);
      return null;
    }
  }

  //NEW RETURN
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
    //console.log('Entra')
    const response = await fetch(`http://10.50.91.88:8008/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      //console.log('Retrieve Info json: ',json);
      return json;
    }
  } catch (error) {
    //console.log(error);
  }
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;