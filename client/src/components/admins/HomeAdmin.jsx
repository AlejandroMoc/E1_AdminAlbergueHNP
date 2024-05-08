import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
import {RiUserAddFill} from "react-icons/ri";
import {IoDocumentAttach} from "react-icons/io5";
import {IoIosBed} from "react-icons/io";
import {IoIosListBox} from "react-icons/io";
import {Link} from "react-router-dom";
import { useAuth } from '../../auth/AuthProvider';

const HomeAdmin = () => {

  const auth=useAuth();

  return (
    <div className='App_minheight'>
      <br/>
      {/*TODO meterle aleatorización de unos 10 mensajes cada vez*/}
      <h2>¡Te damos la bienvenida, {auth.getUser()?.username || ""}!</h2>
      <table className='universal_header_table'>
        <tbody>
          <tr>
            {/* Boton 1 */}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/usernew">
                <table className='universal_header_table2'>
                    <tbody>
                      <tr><td><RiUserAddFill size={80}/></td></tr>
                      <tr><td>Registro de<br/>Nuevo Cliente</td></tr>
                    </tbody>
                </table>
              </Link>
            </td>

            {/* Boton 3*/}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/beds">
                <table className='universal_header_table2'>
                  <tbody>
                    <tr><td><IoIosBed size={80}/></td></tr>
                    <tr><td>Administración<br/>de Camas</td></tr>
                  </tbody>
                </table>
              </Link>
            </td>

          </tr>

          <tr>
            {/* Boton 4 */}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/userlist">
                <table className='universal_header_table2'>
                  <tbody>
                    <tr><td><IoIosListBox size={80}/></td></tr>
                    <tr><td>Administración<br/>de Clientes</td></tr>
                  </tbody>
                </table>
              </Link>
            </td>

            {/* Boton 2 */}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/reports">
                <table className='universal_header_table2'>
                  <tbody>
                    <tr><td><IoDocumentAttach size={80}/></td></tr>
                    <tr><td>Generación de<br/>Nuevo Reporte</td></tr>
                  </tbody>
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