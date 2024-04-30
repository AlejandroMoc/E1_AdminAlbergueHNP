import React from 'react';
import "./LoginAdmin.scss";
import "./LoginAdmin.scss";
import logohnp from '../../assets/logos/logo_hnp.svg';
import {Link} from "react-router-dom";

const LoginAdmin = () => {
  return (
    <div className='App_minheight_login'>
      <br />
      <br />
      <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2> 
      
      <br></br>
      <br></br>
      
      
      <br></br>
      <br></br>
      
      <div>
        <center>
        <table className='login_table'>
          <center>
          <thead><tr><img src={logohnp} class ="login_header_logo" alt="logo"/></tr></thead>
          <tbody >
            <tr><h3 className='titulo-bienvenido'>¡Te damos la bienvenida!</h3></tr>
            <tr><h3 className='titulo-bienvenido'>¡Te damos la bienvenida!</h3></tr>
            <tr> 
            <td><input type="text" id="usuario" name="usuario" placeholder="Usuario"></input></td>
            </tr>
            <tr> 
            <td><input type="password" id="contraseña" name="contraseña" placeholder="Contraseña"></input></td>
            </tr>
            <tr>
            <Link to ="/"><button className='App_buttonaccept'>Iniciar sesión </button></Link>
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
