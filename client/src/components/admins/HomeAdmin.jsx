import React from 'react';
import "./UniversalAdmin.scss";
import "./HomeAdmin.scss";

//Importar elementos
import {RiUserAddFill} from "react-icons/ri";
import {IoDocumentAttach} from "react-icons/io5";
import {IoIosBed} from "react-icons/io";
import {IoIosListBox} from "react-icons/io";
import {Link} from "react-router-dom";
import {useAuth } from '../../auth/AuthProvider';

const HomeAdmin = () => {

  const auth = useAuth();

  const welcomeMessages = [
    `¡Te damos la bienvenida, ${auth.getUser()?.nombre_u || ""}!`,
    `Ten un buen día, ${auth.getUser()?.nombre_u || ""}.`,
    `Esperamos que hoy sea un buen día, ${auth.getUser()?.nombre_u || ""}.`,
    `Tu potencial es infinito, ${auth.getUser()?.nombre_u || ""}.`,
    `El cielo es el límite, ${auth.getUser()?.nombre_u || ""}.`,
    `Hoy es un buen día para hacer un cambio, ${auth.getUser()?.nombre_u || ""}.`,
    `Tu límite son las estrellas, ${auth.getUser()?.nombre_u || ""}.`,
    `Hoy es un día para el bien, ${auth.getUser()?.nombre_u || ""}.`,
    `¿Qué tal, ${auth.getUser()?.nombre_u || ""}?`,
    `Nadie es innecesario, ${auth.getUser()?.nombre_u || ""}.`,
  ];
  
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  const randomWelcomeMessage = welcomeMessages[randomIndex];

  return (
    <div className='App_minheight'>
      <br/>
      <h2 className="home_welcomemessage">{randomWelcomeMessage}</h2>
      
      <table className='universal_header_table'>
        <tbody>
          <tr>
            {/* Boton 1 */}
            <td className='home_squarebutton'>
              <Link className= 'home_text_squarebutton' to="/usernew/4">
                <table className='home_text_squarebutton2'>
                    <tbody>
                      <tr><td><RiUserAddFill size={80}/></td></tr>
                      <tr><td>Registro de<br/>Nuevo Cliente</td></tr>
                    </tbody>
                </table>
              </Link>
            </td>

            {/* Boton 3*/}
            <td className='home_squarebutton'>
              <Link className= 'home_text_squarebutton' to="/beds">
                <table className='home_text_squarebutton2'>
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
            <td className='home_squarebutton'>
              <Link className= 'home_text_squarebutton' to="/userlist">
                <table className='home_text_squarebutton2'>
                  <tbody>
                    <tr><td><IoIosListBox size={80}/></td></tr>
                    <tr><td>Administración<br/>de Clientes</td></tr>
                  </tbody>
                </table>
              </Link>
            </td>

            {/* Boton 2 */}
            <td className='home_squarebutton'>
              <Link className= 'home_text_squarebutton' to="/reports">
                <table className='home_text_squarebutton2'>
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
      <br/>
    </div>
  )
}

export default HomeAdmin