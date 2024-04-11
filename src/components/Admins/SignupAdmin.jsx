import React from 'react';
import "./SingupAdmin.scss";
import logohnp from '../../assets/logos/logo_hnp.svg';

const SignupAdmin = () => {
  return (
    <div className='App-minheight' >
      <br />
      <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2> 

      <div>
        <center>
        <table className='table1'>
          <center>
          <thead><tr><img src={logohnp} class ="header-logo" alt="logo"/></tr></thead>
          <tbody >
            <tr><h3 className='titulo-bienvenido'>¡Bienvenido!</h3></tr>
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
