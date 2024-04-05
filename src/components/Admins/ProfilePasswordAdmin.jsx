import React from 'react';
import "./HomeAdmin.css";

//Importar elementos
///Iconos
import {IoKey} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
///Link e imagenes
import {Link} from "react-router-dom";

const ProfilePasswordAdmin = () => {
  return (
    <div className='App-minheight'>
      
      <table className= 'header-table3'>
        <h1>Administradora</h1>
        <p className= 'header-text' to="/"><IoKey/>Cambiar contraseña</p>

        {/*Formato de cambiar contraseña*/}
        <p><input className= 'header-input' type="password" id="oldpass" name="oldpassword" minlength="8" maxlength="16" required placeholder="Contraseña actual" /></p>
        <p><input className= 'header-input' type="password" id="pass" name="password" minlength="8" maxlength="16" required placeholder="Nueva Contraseña" /></p>
        <p><input className= 'header-input' type="password" id="pass2" name="password2" minlength="8" maxlength="16" required placeholder="Confirmar Nueva Contraseña" /></p>


        {/*Tabla de botones*/}
        <p>
            <input className= 'header-inputbutton header-colorcancel' type="submit" value="Cancelar" />
            <input className= 'header-inputbutton header-coloraccept' type="submit" value="Cambiar contraseña" />
        </p>
        
      </table>
    </div>
  )
}

export default ProfilePasswordAdmin
