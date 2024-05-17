import React from 'react';
import "./UniversalAdmin.scss";

//Importar elementos
import {IoKey} from "react-icons/io5";
import {useAuth} from '../../auth/AuthProvider';
import {Link} from "react-router-dom";

const ProfilePasswordAdmin = () => {

  const auth = useAuth();

  return (
    <div className='App_minheight'>
      
      <table className='universal_header_table universal_header_table2'>
        <tbody>
          <tr>
            <td>
              <h1>{auth.getUser()?.nombre_u || "Admin"}</h1>
              <p className= 'universal_header_text' to="/"><IoKey/>Cambiar contraseña</p>

              {/*Formato de cambiar contraseña*/}
              <p><input type="password" id="oldpass" name="oldpassword" minLength="8" maxLength="16" required placeholder="Contraseña actual" /></p>
              <p><input type="password" id="pass" name="password" minLength="8" maxLength="16" required placeholder="Nueva Contraseña" /></p>
              <p><input type="password" id="pass2" name="password2" minLength="8" maxLength="16" required placeholder="Confirmar Nueva Contraseña" /></p>
              
              
              <Link to="/profile"><p><button className="App_buttoncancel">Cancelar</button></p></Link>
              <p><button className="App_buttonaccept">Cambiar contraseña</button></p>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  )
}

export default ProfilePasswordAdmin
