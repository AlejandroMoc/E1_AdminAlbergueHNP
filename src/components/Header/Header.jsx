import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./Header.css";
//Importar logos
import {FaBed} from "react-icons/fa";
import {FaUser} from "react-icons/fa";
//Importar assets
import logohnp from '../../assets/logos/logo_hnp.svg';

const Header = () => {
  return (
    <div className='header'>
        <Navbar />
        <div>
            <h1 className='header-title'>Administrador del albergue</h1>
            {/*TODO verificar clase*/}
            <p>Administrador de servicios para el albergue del Hospital del Niño Poblano.</p>
            <img src={logohnp} className ="header-logo" alt="logo"/>
            <p>
              {/* TODO unir enlaces */}
              {/*<a className = "App-link" href="#">Administrar usuarios</a>*/}
              <a href = "/" className='header-linkbutton'>
                  <FaBed/><span>Administrar salas</span>
              </a>
            </p>
            <p>
              <a href = "/" className='header-linkbutton'>
                  <FaUser/><span>Administrar usuarios</span>
              </a>
            </p>
        </div>
    </div>
  )
}

export default Header