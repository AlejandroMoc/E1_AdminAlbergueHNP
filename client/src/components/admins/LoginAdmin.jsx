import React from 'react';
import {useState } from 'react';
import {Navigate} from "react-router-dom";
import {useAuth } from '../../auth/AuthProvider';
import "./LoginAdmin.scss";
import logohnp from '../../assets/vectors/logo_hnp.svg';

const LoginAdmin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Redirigir a dashboard si ya se está autenticado
  const auth = useAuth();

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
      
      <div className='login_table'>
          <div><img src={logohnp} class ="login_header_logo" alt="logo"/></div>

          <h3>¡Te damos la bienvenida!</h3>

          <input value={username} onChange={(e)=>setUsername(e.target.value)} className="login_inputs" type="text" placeholder="Usuario"></input>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="login_inputs" type="password" placeholder="Contraseña"></input>
          <button className="login_inputs App_buttonaccept">Iniciar sesión </button>
      </div>

    </div>
  )
}

export default LoginAdmin
