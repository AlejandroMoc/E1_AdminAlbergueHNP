import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
import {IoKey} from "react-icons/io5";
import {FaUserCircle} from "react-icons/fa";
import {Link} from "react-router-dom";
import { useAuth } from '../../auth/AuthProvider';

const ProfileAdmin = () => {

  const auth = useAuth();

  async function handleSignOut(e){
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/signout/',{
        method: "DELETE",
        headers:{
          'Content-type': 'application/json; charset=UTF-8',
          Authorization:`Bearer ${auth.getRefreshToken()}`,
        },
      });
      
      if (response.ok){
        auth.signOut();
        const goTo = useNavigate();
        // goTo("/login");
      }

    } catch (error){

    }
  }

  return (
    <div className='App_minheight'>
      
      <table className= 'universal_header_table3'>
        <FaUserCircle size={160}/>
        <h1 className="universal_header_texttitle">Administradora</h1>
        <Link to="/changepassword"><p><button className="App_buttonaccept"><IoKey/>Cambiar contraseña</button></p></Link>
        <p><button className="App_buttoncancel" onClick={handleSignOut}>Cerrar sesión</button></p>
      </table>
    </div>
  )
}

export default ProfileAdmin
