import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
///Iconos
import {IoKey} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
///Link e imagenes
import {Link} from "react-router-dom";

const ProfilePasswordAdmin = () => {
  return (
    <div class='App-minheight'>
      
      <table class= 'header-table3'>
        <h1 class="header-textitle">Administradora</h1>
        <p class= 'header-text' to="/"><IoKey/>Cambiar contraseña</p>

        {/*Formato de cambiar contraseña*/}
        <p><input type="password" id="oldpass" name="oldpassword" minlength="8" maxlength="16" required placeholder="Contraseña actual" /></p>
        <p><input type="password" id="pass" name="password" minlength="8" maxlength="16" required placeholder="Nueva Contraseña" /></p>
        <p><input type="password" id="pass2" name="password2" minlength="8" maxlength="16" required placeholder="Confirmar Nueva Contraseña" /></p>
        
        {/*Botones*/}
        {/* <p>
          <input class= 'header-inputbutton header-colorcancel' type="submit" value="Cancelar" />
          <input class= 'header-inputbutton header-coloraccept' type="submit" value="Cambiar contraseña" />
        </p> */}

        <p><button class="header-colorcancel">Cancelar</button></p>
        <p><button class="header-coloraccept">Cambiar constraseña</button></p>

      </table>
    </div>
  )
}

export default ProfilePasswordAdmin
