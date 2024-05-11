import React from 'react';
import {useState } from 'react';
import {Navigate, useNavigate} from "react-router-dom";
import {useAuth } from '../../auth/AuthProvider';
import { AuthResponse,AuthResponseError, AccessTokenResponse} from '../../types/types';

import "./LoginAdmin.scss";
import logohnp from '../../assets/vectors/logo_hnp.svg';

const LoginAdmin = () => {

  const [nombre_u, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Redirigir a dashboard si ya se está autenticado
  const auth = useAuth();
  const goTo = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log(e)
      const response = await fetch("http://localhost:8000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          nombre_u,
          password
        })
      });
  
      if (response.ok) {
        console.log("Login successful");
        // setErrorResponse("");
        // const json = (await response.json()) as AuthResponse;
        const json = await response.json();
        console.log("Response JSON:", json);
        
        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json.body);
          goTo("/dashboard");
        }

        // goTo("/");
      } else {
        console.log("Something went wrong");
        // const json = await response.json() as AuthResponseError;
        // const json: AuthResponseError = await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard"/>
  }

  return (
    <div className='App_minheight_login'>
      <br />
      <br />
      <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2>
      
      <br/>
      
      <form className='login_table' onSubmit={handleSubmit}>
          <div><img src={logohnp} className="login_header_logo" alt="logo"/></div>

          <h3>¡Te damos la bienvenida!</h3>

          <input value={nombre_u} onChange={(e)=>setUsername(e.target.value)} className="login_inputs" type="text" placeholder="Usuario"></input>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="login_inputs" type="password" placeholder="Contraseña"></input>
          <button className="login_inputs App_buttonaccept">Iniciar sesión </button>
      </form>

    </div>
  )
}

export default LoginAdmin
