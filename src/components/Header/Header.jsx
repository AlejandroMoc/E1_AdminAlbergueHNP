import React from 'react';
import "./Header.css";

//Importar elementos
import {FaBed} from "react-icons/fa";
import {FaUser} from "react-icons/fa";
import {Link} from "react-router-dom";
import logohnp from '../../assets/logos/logo_hnp.svg';

const Header = () => {
  return (
    <div className='header'>
      {/*TODO verificar css y diseño*/}
      <h1 className='header-title'>Administrador del albergue</h1>
      <p>Administrador de servicios para el albergue del Hospital del Niño Poblano.</p>
      <img src={logohnp} className ="header-logo" alt="logo"/>
      
      {/* <p>
        <Link className= 'header-linkbutton' to="/rooms"> <FaBed/> Administrar salas </Link>
      </p>
      <p>
      <Link className= 'header-linkbutton' to="/users"> <FaUser/> Administrar usuarios </Link>
      </p> */}

      {/*Tabla de enlaces*/}
      <table className='header-table'>
        <tbody>
          <tr>
            <td><Link className= 'header-linkbutton' to="/rooms"> <FaUser/> Link 1 </Link></td>
            <td><Link className= 'header-linkbutton' to="/rooms"> <FaBed/> Link 2 </Link></td>
          </tr>
          <tr>
            <td><Link className= 'header-linkbutton' to="/rooms"> <FaBed/> Link 3 </Link></td>
            <td><Link className= 'header-linkbutton' to="/rooms"> <FaBed/> Link 4 </Link></td>
          </tr>
        </tbody>
      </table>
    </div>


    //Tabla de botones
  )
}

export default Header