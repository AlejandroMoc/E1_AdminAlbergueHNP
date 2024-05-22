import React from 'react';
import { useState } from 'react';
import { Form } from 'react-bootstrap'; 
import MyToastContainer, {successToast, errorToast } from '../universal/MyToast';
import "./LoginAdmin.scss";
import logohnp from '../../assets/vectors/logo_hnp.svg';
// import {AuthResponseError } from '../../types/types';

const SignUpAdmin = () => {
  const [username, setUsername] = useState("");
  const usernameChange = (event) => {
    setUsername(event.target.value)
    setChangeErrorMessage('')
  }

  const [password, setPassword] = useState("");
  const passwordChange = (event) => {
    setPassword(event.target.value)
    setChangeErrorMessage('')
  }

  const [isAdmin, setIsAdmin] = useState(false);

  //Mensaje de error y éxito
  const [changeErrorMessage, setChangeErrorMessage] = useState('');
  const [changeSuccessMessage, setChangeSuccessMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password){
      setChangeErrorMessage('ALERTA: Se deben ingresar los campos.');
    }
    else if(username === password){
      setChangeErrorMessage('ALERTA: Los campos no pueden ser iguales.');
    }
    else{
      try {
        const response = await fetch("http://localhost:8000/signup", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            username,
            password,
            isAdmin
          })
        });
    
        if (response.ok) {
          console.log("User created successfully",response);
          setChangeSuccessMessage('Se creó el usuario correctamente.');
          console.log("Sí me voy a / en SignUpAdmin.jsx 36");
          setUsername('')
          setPassword('')
          successToast()
          // goTo("/");
        } else {
          console.log("Something went wrong");
          setChangeErrorMessage('Usuario Existente');
          errorToast()
          // const json = await response.json() as AuthResponseError;
          // const json: AuthResponseError = await response.json();
        }
      } catch (error) {
        errorToast()
        console.log(error);
      }
    }


  }

  // if (auth.isAuthenticated) {
  //   return <Navigate to="/dashboard"/>
  // }

  return (
    <div className='App_minheight'>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2>
      <br/> */}

      <form className='login_table' onSubmit={handleSubmit}>
          <div><img src={logohnp} className="login_header_logo" alt="logo"/></div>

          <h3>Crear un administrador</h3>
          {/* <p className='universal_text_success'>{changeSuccessMessage}</p> */}

          <input value={username} onChange={(e)=>usernameChange(e)} className="login_inputs" type="text" minLength="8" maxLength="16" placeholder="Usuario"></input>
          <input value={password} onChange={(e)=>passwordChange(e)} className="login_inputs" type="password" minLength="8" maxLength="16" placeholder="Contraseña"></input>
          <p className='universal_text_error'>{changeErrorMessage}</p>
          
          <Form.Check
            className='admin_checkbox'
            type='checkbox'
            id='isAdmin'
            label='Administrador'
            checked={isAdmin}
            onChange={() => setIsAdmin(prevIsAdmin => !prevIsAdmin)}
          />
          
          <button className="login_inputs App_buttonaccept">Registrar</button>
      </form>
      <MyToastContainer />

    </div>
  )
}

export default SignUpAdmin
