import React from 'react';
import {useState } from 'react';
import MyToastContainer, {successToast, errorToast } from '../universal/MyToast';
// import {Navigate, useNavigate} from "react-router-dom";
import "./LoginAdmin.scss";
import logohnp from '../../assets/vectors/logo_hnp.svg';
// import {AuthResponseError } from '../../types/types';

const SignUpAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
  
      if (response.ok) {
        console.log("User created successfully",response);
        console.log("Sí me voy a / en SignUpAdmin.jsx 36");
        setUsername('')
        setPassword('')
        successToast()
        // goTo("/");
      } else {
        console.log("Something went wrong");
        errorToast()
        // const json = await response.json() as AuthResponseError;
        // const json: AuthResponseError = await response.json();
      }
    } catch (error) {
      errorToast()
      console.log(error);
    }
  }

  // if (auth.isAuthenticated) {
  //   return <Navigate to="/dashboard"/>
  // }

  return (
    <div className='App_minheight'>
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2>
      
      <br/> */}
      
      <form className='login_table' onSubmit={handleSubmit}>
          <div><img src={logohnp} className="login_header_logo" alt="logo"/></div>

          <h3>Crear un administrador</h3>

          <input value={username} onChange={(e)=>setUsername(e.target.value)} className="login_inputs" type="text" placeholder="Usuario"></input>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="login_inputs" type="password" placeholder="Contraseña"></input>
          <button className="login_inputs App_buttonaccept">Registrarse</button>
      </form>
      <MyToastContainer />

    </div>
  )
}

export default SignUpAdmin
