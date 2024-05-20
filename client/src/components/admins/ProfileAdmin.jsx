import React, { useEffect, useState } from 'react';
import "./UniversalAdmin.scss";
import "./HomeAdmin.scss";

//Importar elementos
import {IoKey} from "react-icons/io5";
import {FaUserCircle, FaPlus} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useAuth } from '../../auth/AuthProvider';

const ProfileAdmin = () => {

  //Para cierre de sesion
  const auth = useAuth();

  async function handleSignOut(e){
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/signout/',{
        method: "DELETE",
        headers:{
          'Content-type': 'application/json; charset=UTF-8',
          Authorization:`Bearer ${auth.getRefreshToken()}`,
        },
      });
      
      if (response.ok){
        auth.signOut();
        // const goTo = useNavigate();
        // goTo("/login");
      }

    } catch (error){
      console.log(error);
    }
  }

  //Para añadir administrador
    //Para manejo de sesiones
    const id_u = useAuth().getUser().id_usuario
    const [adminInfo, setAdminInfo] = useState([])
    // console.log(id_u)
  
    //Llamada a la función para información de usuario
    useEffect(() => {
      fetch('http://localhost:8000/infouser', {
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
  

  //Diseño
  return (
    <div className='App_minheight'>
      <table className= 'universal_header_table universal_header_table2'>
        <tbody>
          <tr>
            <td>
                <FaUserCircle size={160}/>
                <h1 className="universal_header_texttitle">{auth.getUser()?.nombre_u || "Admin"}</h1>
                {adminInfo.admin ? <Link to="/adminnew"><p><button className="App_buttonaccept"><FaPlus/> Crear un administrador</button></p></Link> : ''}
                <Link to="/changepassword"><p><button className="App_buttonaccept"><IoKey/> Cambiar contraseña</button></p></Link>
                <p><button className="App_buttoncancel" onClick={handleSignOut}>Cerrar sesión</button></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfileAdmin
