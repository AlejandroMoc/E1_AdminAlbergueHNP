import React from 'react';
import "./SingupAdmin.scss";
import logohnp from '../../assets/logos/logo_hnp.svg';

const SignupAdmin = () => {
  return (
    <div class='App-minheight' >
      <br />
      <h1 class='titulo-grande1'>Administrador del Albergue</h1>
      <p class='titulo-grande2'>Hospital del Niño Poblano</p> 

      <div>
        <center>
        <table class='table1'>
          <center>
          <thead><tr><img src={logohnp} class ="header-logo" alt="logo"/></tr></thead>
          <tbody >
            <tr><p class='titulo-bienvenido'>¡Bienvenido!</p></tr>
            <tr> 
            <td><input type="text" id="usuario" name="usuario" placeholder="Usuario"></input></td>
            </tr>
            <tr> 
            <td><input type="password" id="contraseña" name="contraseña" placeholder="Contraseña"></input></td>
            </tr>
            <tr> 
            <button>Iniciar Sesión</button>

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
