import React from 'react';
import "./LoginAdmin.scss";
import "./LoginAdmin.scss";
import logohnp from '../../assets/vectors/logo_hnp.svg';
// import {Link} from "react-router-dom";
import { useForm } from '../../hook/UseForm';

const LoginAdmin = () => {

  //Diccionario de datos de login
  const {username, password, onInputChange, onResetForm} = 
  useForm({
    username: '',
    password: '',
  });

  return (
    <div className='App_minheight_login'>
      <br />
      <br />
      <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2>
      
      <br/>
      
      <div>
        <center>
        <table className='login_table'>
          <center>
            <thead><tr><img src={logohnp} class ="login_header_logo" alt="logo"/></tr></thead>
            <tbody >
              <tr>
                <h3 className='titulo-bienvenido'>¡Te damos la bienvenida!</h3></tr>
              <tr>
              <td>
                <input type="text" id="usuario" name="usuario" placeholder="Usuario"></input></td>
              </tr>
              <tr> 
              <td>
                <input type="password" id="contraseña" name="contraseña" placeholder="Contraseña"></input></td>
              </tr>
              <tr>
                <button type="submit" className='App_buttonaccept'>Iniciar sesión </button>
              </tr>
            </tbody>
          </center>
        </table>
        </center>
      </div>

    </div>
  )
}

export default LoginAdmin
