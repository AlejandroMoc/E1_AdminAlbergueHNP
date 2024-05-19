import React from 'react';
import "./UniversalAdmin.scss";
import {useState } from 'react';
import {IoKey} from "react-icons/io5";
import {useAuth} from '../../auth/AuthProvider';
import {Link} from "react-router-dom";
import MyToastContainer, {successToast, errorToast } from '../universal/MyToast';

const ProfilePasswordAdmin = () => {

  const auth = useAuth();

  const [actual_password, setActualPassword] = useState("");
  const [new_password1, setNewPassword1] = useState("");
  const [new_password2, setNewPassword2] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/changepassword", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          actual_password,
          new_password1,
          new_password2
        })
      });
  
      if (response.ok) {
        console.log("User created successfully",response);
        console.log("Sí me voy a / en SignUpAdmin.jsx 36");
        setActualPassword('')
        setNewPassword1('')
        setNewPassword2('')
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

  return (
    <div className='App_minheight'>
      
      <form className='universal_header_table universal_header_table2'>
        <h1>{auth.getUser()?.nombre_u || "Admin"}</h1>
        <p className= 'universal_header_text' to="/"><IoKey/>Cambiar contraseña</p>

        {/*Formato de cambiar contraseña*/}
        <p><input value={actual_password} onChange={(e)=>setActualPassword(e.target.value)} type="password" id="oldpass" name="oldpassword" minLength="8" maxLength="16" required placeholder="Contraseña actual" /></p>
        <p><input value={new_password1} onChange={(e)=>setNewPassword1(e.target.value)} type="password" id="pass" name="password" minLength="8" maxLength="16" required placeholder="Nueva Contraseña" /></p>
        <p><input value={new_password2} onChange={(e)=>setNewPassword2(e.target.value)} type="password" id="pass2" name="password2" minLength="8" maxLength="16" required placeholder="Confirmar Nueva Contraseña" /></p>
        
        
        {/* <input value={username} onChange={(e)=>setUsername(e.target.value)} className="login_inputs" type="text" placeholder="Usuario"></input>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} className="login_inputs" type="password" placeholder="Contraseña"></input> */}

        <Link to="/profile"><p><button className="App_buttoncancel">Cancelar</button></p></Link>
        <p><button className="App_buttonaccept">Cambiar contraseña</button></p>
      </form>
    </div>
  )
}

export default ProfilePasswordAdmin
