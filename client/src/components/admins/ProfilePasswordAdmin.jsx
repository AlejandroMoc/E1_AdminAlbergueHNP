//Importar elementos
import React from 'react';
import "./UniversalAdmin.scss";
import {useState } from 'react';
import MyToastContainer, {successToast, errorToast } from '../universal/MyToast';
import { API_URL } from '../../App';
//Importar íconos
import {IoKey} from "react-icons/io5";
import {useAuth} from '../../auth/AuthProvider';
import {Link} from "react-router-dom";

//Función de admin
const ProfilePasswordAdmin = () => {

  //Verificación de inicio de sesión
  const auth = useAuth();

  //Obtener nombre de usuario
  const username = auth.getUser()?.nombre_u;
  
  //Constantes para los inputs y sus mensajes de error
  const [actual_password, setActualPassword] = useState("");
  const apChange = (event) => {
    setActualPassword(event.target.value)
    setErrorMessage('')
  }

  const [new_password1, setNewPassword1] = useState("");
  const p1Change = (event) => {
    setNewPassword1(event.target.value)
    setErrorMessage('')
  }

  const [new_password2, setNewPassword2] = useState("");
  const p2Change = (event) => {
    setNewPassword2(event.target.value)
    setErrorMessage('')
  }

  //Mensajes de error y éxito
  const [ErrorMessage, setErrorMessage] = useState('');
  const [changeSuccessMessage, setChangeSuccessMessage] = useState('');

  //Función para formulario de cambio de contraseña
  async function handleSubmit(e) {
    e.preventDefault();

    //Prevención de errores
    //Si están vacíos los campos
    if (!new_password1 || !new_password2 || !actual_password){
      setErrorMessage('ALERTA: Se deben ingresar los campos.');
    }
    //Si las contraseñas nuevas son iguales
    else if (new_password1 !== new_password2){
      setErrorMessage('ALERTA: Las contraseñas nuevas deben ser iguales.');
    }
    //Si contraseña anterior y actual son iguales
    else if (new_password1 === actual_password || new_password2 === actual_password){
      setErrorMessage('ALERTA: La contraseña nueva no puede ser igual a la anterior.');
    }
    else{

      //En caso de no haber errores, acceder a changepass
      try {
        const response = await fetch(`${API_URL}/changepass`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          //Convertir a string json los datos del formulario
          body: JSON.stringify({
            username,
            actual_password,
            new_password1,
            new_password2,
          })
        });
    
        //Si la solicitud es exitosa
        if (response.ok) {
          //Mencionar que se cambió la contraseña con éxito
          // console.log("Password changed succesfully",response);
          setChangeSuccessMessage('Se cambió la contraseña correctamente.');
          //Vaciar datos de los inputs
          setActualPassword('')
          setNewPassword1('')
          setNewPassword2('')
          //Mostrar toast de exito
          successToast()
          // goTo("/");
        
        //En caso contrario mostrar Toast de error
        } else {
          //console.log("Something went wrong");
          setErrorMessage('Credenciales incorrectas. Intente de nuevo.');
          errorToast()
          // const json = await response.json() as AuthResponseError;
          // const json: AuthResponseError = await response.json();
        }
  
      //Finalmente cachar cualquier otro error
      } catch (error) {
        errorToast()
        //console.log(error);
      }
    }
  }

  //Dibujado de elementos
  return (
    <div className='App_minheight'>
      {/*Formulario para cambio de contraseña*/}
      <form className='universal_header_table universal_header_table2' onSubmit={handleSubmit}>
        <h1 className='universal_marginbottom'>{auth.getUser()?.nombre_u || "Admin"}</h1>
        <p className= 'universal_header_text universal_marginbottom' to="/"><IoKey/>Cambiar contraseña</p>

        {/*Inputs de contraseña actual y antigua*/}
        <p><input className="universal_limit_input universal_marginbottom" value={actual_password} onChange={(e)=>apChange(e)} type="password" id="oldpass" name="oldpassword" minLength="8" maxLength="16" onkeypress="return event.charCode != 32" required placeholder="Contraseña actual" /></p>
        <p><input className="universal_limit_input universal_marginbottom" value={new_password1} onChange={(e)=>p1Change(e)} type="password" id="pass" name="password" minLength="8" maxLength="16" onkeypress="return event.charCode != 32" required placeholder="Nueva Contraseña" /></p>
        <p><input className="universal_limit_input universal_marginbottom" value={new_password2} onChange={(e)=>p2Change(e)} type="password" id="pass2" name="password2" minLength="8" maxLength="16" onkeypress="return event.charCode != 32" required placeholder="Confirmar Nueva Contraseña" /></p>
        
        {/*Mensaje de error y de éxito (se puede habilitar el de éxito)*/}
        <p className='universal_text_error'>{ErrorMessage}</p>
        {/* <p className='universal_text_success'>{changeSuccessMessage}</p> */}

        {/*Botón de cancelación de cambio de contraseña, el cual redirige a la página de perfil*/}
        <Link to="/profile"><p><button className="App_buttoncancel universal_limit_input">Cancelar</button></p></Link>
        {/*Botón que envía a función de cambio de contraseña*/}
        <p><button className="App_buttonaccept universal_limit_input">Cambiar contraseña</button></p>
      </form>
      <MyToastContainer />
    </div>
  )
}

//Exportación de elemento default
export default ProfilePasswordAdmin
