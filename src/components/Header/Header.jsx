import React from 'react';
import "./Header.css";

//Importar elementos
import {FaBed} from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import { RiUserAddFill } from "react-icons/ri";
import { RiUserSharedFill } from "react-icons/ri";
import {Link} from "react-router-dom";
import logohnp from '../../assets/logos/logo_hnp.svg';

const Header = () => {
  return (
    <div className='header'>
      {/*TODO verificar css y diseño*/}
      <h1 className='header-title'>Administrador del albergue</h1>
      <p>Administrador de servicios para el albergue del Hospital del Niño Poblano.</p>
      <img src={logohnp} className ="header-logo" alt="logo"/>

      {/*Tabla de enlaces*/}
      <table className='header-table'>
        <tbody>
          <tr>
            <td><Link className= 'header-linkbutton' to="/rooms"> <FaBed/> Camas por zona </Link></td>
            <td><Link className= 'header-linkbutton' to="/rooms"> <RiUserSharedFill /> Única entrada </Link></td>
          </tr>
          <tr>
            <td><Link className= 'header-linkbutton' to="/rooms"> <IoIosListBox /> Lista de Huéspedes </Link></td>
            <td><Link className= 'header-linkbutton' to="/rooms"> <RiUserAddFill/> Nuevo Huésped </Link></td>
          </tr>
        </tbody>
      </table>
    </div>


    //Tabla de botones
  )
}

export default Header