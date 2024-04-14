import React from 'react';
import "./LoginAdmin.scss";
import logohnp from '../../assets/logos/logo_hnp.svg';

const LoginAdmin = () => {
  return (
    <div className='App-minheight2'>
      <br />
      <br />
      <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2> 
      
      <br></br>
      <br></br>
      
      <div>
        <center>
        <table className='table1'>
          <center>
          <thead><tr><img src={logohnp} class ="header-logo" alt="logo"/></tr></thead>
          <tbody >
            <tr><h3 className='titulo-bienvenido'>¡Te damos la bienvenida!</h3></tr>
            <tr> 
            <td><input type="text" id="usuario" name="usuario" placeholder="Usuario"></input></td>
            </tr>
            <tr> 
            <td><input type="password" id="contraseña" name="contraseña" placeholder="Contraseña"></input></td>
            </tr>
            <tr> 
            <button className='Appglobal-buttonaccept'>Iniciar Sesión</button>

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
