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
        {/* TODO URGENTE cambiar elementos a botones */}

        <Link to="/changepassword"><p><button className="Appglobal-buttonaccept"><IoKey/>Cambiar contraseña</button></p></Link>
        <Link to="/login"><p><button className="Appglobal-buttoncancel">Cerrar sesión</button></p></Link>
      </table>
    </div>
  )
}

export default ProfileAdmin
