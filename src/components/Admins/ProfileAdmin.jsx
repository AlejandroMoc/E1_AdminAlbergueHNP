import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
///Iconos
import {IoKey} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
///Link e imagenes
import {Link} from "react-router-dom";

const ProfileAdmin = () => {
  return (
    <div class='App-minheight'>
      
      <table class= 'header-table3'>
        <FaUserCircle size={160}/>
        <h1 class="header-textitle">Administradora</h1>
        <Link class= 'header-textlink' to="/changepassword"><p><IoKey/>Cambiar contraseña</p></Link>
        <Link class= 'header-textclosesession header-colorcancel' to="/Signup"><p>Cerrar sesión</p></Link>
      </table>

    </div>
  )
}

export default ProfileAdmin
