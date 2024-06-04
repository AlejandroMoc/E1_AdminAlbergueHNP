import React, {useEffect, useState } from 'react';
import "./UniversalAdmin.scss";
import "./HomeAdmin.scss";

//Importar elementos
import {IoKey} from "react-icons/io5";
import {FaUserCircle, FaPlus} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useAuth } from '../../auth/AuthProvider';
import { API_URL } from '../../App';

//Función para admin
const ProfileAdmin = () => {

  //Verificar autenticación
  const auth = useAuth();

  //Función que se manda a llamar al presionar botón de cierre de sesión
  async function handleSignOut(e){
    e.preventDefault();

    //Intentar acceder a /signout
    try {
      const response = await fetch(`${API_URL}/signout/`,{
        method: "DELETE",
        headers:{
          'Content-type': 'application/json; charset=UTF-8',
          Authorization:`Bearer ${auth.getRefreshToken()}`,
        },
      });

      //Si la solicitud es correcta, cerrar la sesión
      if (response.ok){
        auth.signOut();
        // const goTo = useNavigate();
        // goTo("/login");
      }

    //En caso contrario, enviar error de solicitud
    } catch (error){
      res.status(500).json({ error: 'An error occurred while processing the request.' });
      // errorToast()
      //console.log(error);
    }
  }

    //Constantes para obtener información de administrador y establecer información de administrador
    const id_u = useAuth().getUser().id_usuario
    const [adminInfo, setAdminInfo] = useState([])
    // console.log(id_u)
  
    //Llamada a la función para información de usuario
    useEffect(() => {
      fetch(`${API_URL}/infouser`, {
        method: 'POST',
        body: JSON.stringify({id_u: id_u}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((res) => res.json())
      .then((adminInfo) => setAdminInfo(adminInfo))
      .catch((error) => console.error('Error fetching data:', error))
    }, [])
  

  //Retornar dibujado de elementos
  return (
    <div className='App_minheight'>
      <table className= 'universal_header_table universal_header_table2'>
        <tbody>
          <tr>
            <td>
              {/*Ícono de usuario*/}
              <FaUserCircle size="60%"/>
              {/*Header con el nombre del administrador loggeado*/}
              <h1 className="universal_header_texttitle">{auth.getUser()?.nombre_u || "Admin"}</h1>
              {/*Botones de creación de administrador y cambio de contraseña */}
              {adminInfo.admin ? <Link to="/adminnew"><p><button className="App_buttonaccept universal_marginbottom"><FaPlus/> Crear un administrador</button></p></Link> : ''}
              <Link to="/changepassword"><p><button className="App_buttonaccept universal_marginbottom"><IoKey/> Cambiar contraseña</button></p></Link>
              {/*Botón de cierre de sesión*/}
              <p><button className="App_buttoncancel" onClick={handleSignOut}>Cerrar sesión</button></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfileAdmin
