import React from 'react';
import "./HomeAdmin.scss";

//Importar elementos
import {RiUserAddFill} from "react-icons/ri";
import {IoDocumentAttach} from "react-icons/io5";
import {IoIosBed} from "react-icons/io";
import {IoIosListBox} from "react-icons/io";
import {Link} from "react-router-dom";

const HomeAdmin = () => {
  return (
    <div className='App_minheight'>

      <table className='universal_header_table'>
        <tbody>
          <tr>

            {/* Boton 1 */}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/usernew">
                <table className='universal_header_table2'>
                    <tr><RiUserAddFill size={80}/></tr>
                    <tr>Registro de<br/>Nuevo Cliente</tr>
                </table>
              </Link>
            </td>

            {/* Boton 3*/}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/beds">
                <table className='universal_header_table2'>
                    <tr><IoIosBed size={80}/></tr>
                    <tr>Administración<br/>de Camas</tr>
                </table>
              </Link>
            </td>

          </tr>

          <tr>


            {/* Boton 4 */}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/userlist">
                <table className='universal_header_table2'>
                    <tr><IoIosListBox size={80}/></tr>
                    <tr>Administración<br/>de Clientes</tr>
                </table>
              </Link>
            </td>

            {/* Boton 2 */}
            <td className='universal_header_linksquare'>
              <Link className= 'universal_header_textlink' to="/reports">
                <table className='universal_header_table2'>
                    <tr><IoDocumentAttach size={80}/></tr>
                    <tr>Generación de<br/>Nuevo Reporte</tr>
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