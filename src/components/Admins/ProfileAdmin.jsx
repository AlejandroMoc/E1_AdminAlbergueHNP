import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
import {IoKey} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
import {Link} from "react-router-dom";

const ProfileAdmin = () => {
  return (
    <div className='App-minheight'>
      
      <table className= 'header-table3'>
        <FaUserCircle size={160}/>
        <h1 className="header-textitle">Administradora</h1>
        <Link className= 'header-textlink' to="/changepassword"><p><IoKey/>Cambiar contraseña</p></Link>
        <Link className= 'header-textred Appglobal-buttoncancel' to="/login"><h4>Cerrar sesión</h4></Link>
      </table>
    </div>
  )
}

export default ProfileAdmin
