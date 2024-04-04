import React from 'react';
import "./HomeAdmin.css";

//Importar elementos
///Iconos
import {IoKey} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
///Link e imagenes
import {Link} from "react-router-dom";

const ProfileAdmin = () => {
  return (
    <div className='App-minheight'>
      
      <table className= 'header-table3'>
        <FaUserCircle size={160}/>
        <h1>Administradora</h1>
        <Link className= 'header-textlink' to="/"><p><IoKey/>Cambiar contraseña</p></Link>
        <Link className= 'header-textclosesession' to="/Signup"><p>Cerrar sesión</p></Link>
      </table>

    </div>
  )
}

export default ProfileAdmin
