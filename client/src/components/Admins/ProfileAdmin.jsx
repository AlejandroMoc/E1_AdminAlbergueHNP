import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
import {IoKey} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
import {Link} from "react-router-dom";

const ProfileAdmin = () => {
  return (
    <div className='App_minheight'>
      
      <table className= 'universal_header_table3'>
        <FaUserCircle size={160}/>
        <h1 className="universal_header_texttitle">Administradora</h1>
        <Link to="/changepassword"><p><button className="App_buttonaccept"><IoKey/>Cambiar contraseña</button></p></Link>
        <Link to="/login"><p><button className="App_buttoncancel">Cerrar sesión</button></p></Link>
      </table>
    </div>
  )
}

export default ProfileAdmin
