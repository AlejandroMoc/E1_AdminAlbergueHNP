import React from 'react';
import "./HomeAdmin.scss";

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
    <div class='App-minheight'>
      {/* <h1 class='header-title'>Administrador del albergue</h1> */}
      {/* <h2 class='header-subtitle'>Hospital del Niño Poblano</h2> */}
      {/* <img src={logohnp} class ="header-logo" alt="logo"/> */}

      <table class='header-table'>
        <tbody>
          <tr>
            {/* Boton 1 */}
            <td class='header-linksquare'>
              <Link class= 'header-textlink' to="/usernew">
                <table class='header-table2'>
                    <tr><RiUserAddFill size={80}/></tr>
                    <tr>Nuevo Usuario</tr>
                </table>
              </Link>
            </td>
            {/* Boton 2 */}
            <td class='header-linksquare'>
              <Link class= 'header-textlink' to="/reports">
                <table class='header-table2'>
                    <tr><IoDocumentAttach size={80}/></tr>
                    <tr>Nuevo Reporte</tr>
                </table>
              </Link>
            </td>
          </tr>

          <tr>
            {/* Boton 3*/}
            <td class='header-linksquare'>
              <Link class= 'header-textlink' to="/beds">
                <table class='header-table2'>
                    <tr><IoIosBed size={80}/></tr>
                    <tr>Administración<br/>de Camas</tr>
                </table>
              </Link>
            </td>
            {/* Boton 4 */}
            <td class='header-linksquare'>
              <Link class= 'header-textlink' to="/userlist">
                <table class='header-table2'>
                    <tr><IoIosListBox size={80}/></tr>
                    <tr>Administración<br/>de Usuarios</tr>
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