import React from 'react';
import "./HomeAdmin.css";

//Importar elementos
///Iconos
import {RiUserAddFill} from "react-icons/ri";
import {IoDocumentAttach} from "react-icons/io5";
import {IoIosBed} from "react-icons/io";
import {IoIosListBox} from "react-icons/io";
///Link e imagenes
import {Link} from "react-router-dom";
import logohnp from '../../assets/logos/logo_hnp.svg';

const HomeAdmin = () => {
  return (
    <div className='App-minheight'>
      {/* <h1 className='header-title'>Administrador del albergue</h1> */}
      {/* <h2 className='header-subtitle'>Hospital del Niño Poblano</h2> */}
      {/* <img src={logohnp} className ="header-logo" alt="logo"/> */}

      <table className='header-table'>
        <tbody>
          <tr>
            {/* Boton 1 */}
            <td className='header-linksquare'>
              <Link className= 'header-textlink' to="/usernew">
                <table className='header-table2'>
                    <tr><RiUserAddFill size={80}/></tr>
                    <tr>Nuevo Usuario</tr>
                </table>
              </Link>
            </td>
            {/* Boton 2 */}
            <td className='header-linksquare'>
              <Link className= 'header-textlink' to="/reports">
                <table className='header-table2'>
                    <tr><IoDocumentAttach size={80}/></tr>
                    <tr>Nuevo Reporte</tr>
                </table>
              </Link>
            </td>
          </tr>

          <tr>
            {/* Boton 3*/}
            <td className='header-linksquare'>
              <Link className= 'header-textlink' to="/beds">
                <table className='header-table2'>
                    <tr><IoIosBed size={80}/></tr>
                    <tr>Administración de Camas</tr>
                </table>
              </Link>
            </td>
            {/* Boton 4 */}
            <td className='header-linksquare'>
              <Link className= 'header-textlink' to="/userlist">
                <table className='header-table2'>
                    <tr><IoIosListBox size={80}/></tr>
                    <tr>Administración de Usuarios</tr>
                </table>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  )
}

export default HomeAdmin