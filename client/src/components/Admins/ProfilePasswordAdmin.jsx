import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
import {IoKey} from "react-icons/io5";
import {Link} from "react-router-dom";

const ProfilePasswordAdmin = () => {
  return (
    <div className='App-minheight'>
      
      <table className= 'header-table3'>
        <h1 className="header-textitle">Administradora</h1>
        <p className= 'header-text' to="/"><IoKey/>Cambiar contraseña</p>

        {/*Formato de cambiar contraseña*/}
        <p><input type="password" id="oldpass" name="oldpassword" minlength="8" maxlength="16" required placeholder="Contraseña actual" /></p>
        <p><input type="password" id="pass" name="password" minlength="8" maxlength="16" required placeholder="Nueva Contraseña" /></p>
        <p><input type="password" id="pass2" name="password2" minlength="8" maxlength="16" required placeholder="Confirmar Nueva Contraseña" /></p>
        
        <p><button className="Appglobal-buttoncancel">Cancelar</button></p>
        <p><button className="Appglobal-buttonaccept">Cambiar contraseña</button></p>

      </table>
    </div>
  )
}

export default ProfilePasswordAdmin
