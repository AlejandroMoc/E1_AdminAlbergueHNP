import React from 'react';
import "./UniversalAdmin.scss";
import {useState } from 'react';
import {IoKey} from "react-icons/io5";
import {useAuth} from '../../auth/AuthProvider';
import {Link} from "react-router-dom";
import MyToastContainer, {successToast, errorToast } from '../universal/MyToast';

const ProfilePasswordAdmin = () => {

  const auth = useAuth();

  // const [username, setUsername] = useState("");
  const username = auth.getUser()?.nombre_u;
  
  const [actual_password, setActualPassword] = useState("");
  const apChange = (event) => {
    setActualPassword(event.target.value)
    setChangeErrorMessage('')
  }

  const [new_password1, setNewPassword1] = useState("");
  const p1Change = (event) => {
    setNewPassword1(event.target.value)
    setChangeErrorMessage('')
  }

  const [new_password2, setNewPassword2] = useState("");
  const p2Change = (event) => {
    setNewPassword2(event.target.value)
    setChangeErrorMessage('')
  }

  //Mensajes de error y éxito
  const [changeErrorMessage, setChangeErrorMessage] = useState('');
  const [changeSuccessMessage, setChangeSuccessMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!new_password1 || !new_password2 || !actual_password){
      setChangeErrorMessage('ALERTA: Se deben ingresar los campos.');
    }
    else if (new_password1 !== new_password2){
      setChangeErrorMessage('ALERTA: Las contraseñas nuevas deben ser iguales.');
    }
    else if (new_password1 === actual_password || new_password2 === actual_password){
      setChangeErrorMessage('ALERTA: La contraseña nueva no puede ser igual a la anterior.');
    }
    else{

      try {
        const response = await fetch("http://localhost:8000/changepass", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            username,
            actual_password,
            new_password1,
            new_password2,
          })
        });
    
        if (response.ok) {
          console.log("Password changed succesfully",response);
          setChangeSuccessMessage('Se cambió la contraseña correctamente.');
          setActualPassword('')
          setNewPassword1('')
          setNewPassword2('')
          successToast()
          // goTo("/");
        } else {
          console.log("Something went wrong");
          setChangeErrorMessage('Credenciales incorrectas. Intente de nuevo.');
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

  return (
    <div className='App_minheight'>
      <form className='universal_header_table universal_header_table2' onSubmit={handleSubmit}>
        <h1>{auth.getUser()?.nombre_u || "Admin"}</h1>
        <p className= 'universal_header_text' to="/"><IoKey/>Cambiar contraseña</p>

        {/*Formato de cambiar contraseña*/}
        <p><input className="universal_limit_input" value={actual_password} onChange={(e)=>apChange(e)} type="password" id="oldpass" name="oldpassword" minLength="8" maxLength="16" required placeholder="Contraseña actual" /></p>
        <p><input className="universal_limit_input" value={new_password1} onChange={(e)=>p1Change(e)} type="password" id="pass" name="password" minLength="8" maxLength="16" required placeholder="Nueva Contraseña" /></p>
        <p><input className="universal_limit_input" value={new_password2} onChange={(e)=>p2Change(e)} type="password" id="pass2" name="password2" minLength="8" maxLength="16" required placeholder="Confirmar Nueva Contraseña" /></p>
        
        <p className='universal_text_error universal_limit_input'>{changeErrorMessage}</p>
        {/* <p className='universal_text_success'>{changeSuccessMessage}</p> */}

        <Link to="/profile"><p><button className="App_buttoncancel universal_limit_input">Cancelar</button></p></Link>
        <p><button className="App_buttonaccept universal_limit_input">Cambiar contraseña</button></p>
      </form>
      <MyToastContainer />
    </div>
  )
}

export default ProfilePasswordAdmin
