import React from 'react';
import "./Singup.css";
import logohnp from '../../assets/logos/logo_hnp.svg';

const SignupAdmin = () => {
  return (
    <div className='App-minheight1' >
      <br />
      <h1 className='titulo-grande1'>Administrador del Albergue</h1>
      <p className='titulo-grande2'>Hospital del niño Poblano</p> 

      <div>
        <center>
        <table className='table1'>
          <center>
          <thead><tr><img src={logohnp} className ="header-logo" alt="logo"/></tr></thead>
          <tbody >
            <tr><p className='titulo-bienvenido'>¡Bienvenido!</p></tr>
            <tr> 
            <td><input type="text" id="usuario" name="usuario" placeholder="Usuario"></input></td>
            </tr>
            <tr> 
            <td><input type="password" id="contraseña" name="contraseña" placeholder="Contraseña"></input></td>
            </tr>
            <tr> 
            <button class="button">Iniciar Sesión</button>
            </tr>
          </tbody>
          </center>
        </table>
        </center>
      </div>

    </div>
  )
}

export default SignupAdmin
