


//Importar elementos
import React from 'react';
import "./UniversalAdmin.scss";
import "./HomeAdmin.scss";
//Importar íconos
import {RiUserAddFill} from "react-icons/ri";
import {IoDocumentAttach} from "react-icons/io5";
import {IoIosBed} from "react-icons/io";
import {IoIosListBox} from "react-icons/io";
//Importar más elementos
import {Link} from "react-router-dom";
import {useAuth} from '../../auth/AuthProvider';

//Función de componente de administración
const HomeAdmin = () => {

  //Verificar autenticación del sistema
  const auth = useAuth();

  //Mensajes aleatorios de bienvenida
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
    `Todos somos necesarios, ${auth.getUser()?.nombre_u || ""}.`,
    `Todos tenemos un papel importante, ${auth.getUser()?.nombre_u || ""}.`,
    `Sé fiel a tu propia persona, ${auth.getUser()?.nombre_u || ""}.`,
    `Si te caíste ayer, levántate hoy, ${auth.getUser()?.nombre_u || ""}.`,
    `Siempre es adecuado para hacer el bien a otros, ${auth.getUser()?.nombre_u || ""}.`,
    `Hoy puedes dar el primer paso, ${auth.getUser()?.nombre_u || ""}.`,
    `Cree en ti, ${auth.getUser()?.nombre_u || ""}.`,
    `El esfuerzo de hoy es el éxito de mañana, ${auth.getUser()?.nombre_u || ""}.`,
    `Vivir es nacer cada instante, ${auth.getUser()?.nombre_u || ""}.`,
    `Vive la vida que amas. Ama la vida que vives, ${auth.getUser()?.nombre_u || ""}.`,
    `Confía en ti, ${auth.getUser()?.nombre_u || ""}.`,
    `Confía en tu potencial, ${auth.getUser()?.nombre_u || ""}.`,
    `Confío en ti, ${auth.getUser()?.nombre_u || ""}.`,
    `A veces se gana, ${auth.getUser()?.nombre_u || ""}.`,
    `A veces se gana, a veces se pierde, ${auth.getUser()?.nombre_u || ""}.`,
    `A veces se gana, a veces se aprende, ${auth.getUser()?.nombre_u || ""}.`,
    `El cielo está en la tierra, ${auth.getUser()?.nombre_u || ""}.`,
    `No dejes para mañana lo que puedes hacer hoy, ${auth.getUser()?.nombre_u || ""}.`,
    `Un paso a la vez, ${auth.getUser()?.nombre_u || ""}.`,
    `Hoy eres el cambio, ${auth.getUser()?.nombre_u || ""}.`,
    `Que todo lo bueno te siga, te encuentre, y se quede contigo ${auth.getUser()?.nombre_u || ""}.`,
    `¡Lorem Ipsum, ${auth.getUser()?.nombre_u || ""}!`,
  ];
  
  //Randomizador para mensaje de bienvenida
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  //Elegir un mensaje de bienvenida
  const randomWelcomeMessage = welcomeMessages[randomIndex];

  return (
    <div className='App_minheight'>
      <br/>

      {/*Texto de bienvenida*/}
      <h2 className="home_welcomemessage">{randomWelcomeMessage}</h2>
      
      {/*Tabla de botones*/}
      <table className='universal_header_table'>
        <tbody>
          <tr>
            {/*TODO cambiar a función para generar elementos en vez de ir uno por uno*/}
            {/*se debería mandar el link, el icono y el texto*/}

            {/* Boton 1 */}
            <td className='home_squarebutton'>
              <Link className= 'home_text_squarebutton' to="/usernew">
                <table className='home_text_squarebutton2'>
                    <tbody>
                      <tr><td><RiUserAddFill size="28%"/></td></tr>
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
                    <tr><td><IoIosBed size="28%"/></td></tr>
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
                    <tr><td><IoIosListBox size="28%"/></td></tr>
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
                    <tr><td><IoDocumentAttach size="28%"/></td></tr>
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