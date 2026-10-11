// React
import {useState } from 'react';
import {Navigate, useNavigate} from "react-router-dom";

// Components
import {useAuth } from '../../auth/AuthProvider';
import {successToast} from '../universal/MyToast';
import { API_URL } from '../../App';

// CSS
import "./LoginAdmin.scss";

// Icons
import logohnp from '../../assets/vectors/logo_hnp.svg';

const LoginAdmin = () => {

  const [nombre_u, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Redirigir a dashboard si ya se está autenticado
  const auth = useAuth();
  const goTo = useNavigate();

  const [loginErrorMessage, setLoginErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          nombre_u,
          password
        })
      });
  
      if (response.ok) {
        const json = await response.json();
        
        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json.body);
          goTo("/dashboard");
        }
      } else {
        setLoginErrorMessage('Credenciales incorrectas. Intente de nuevo');
        successToast();
      }
    } catch (error) {
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard"/>
  }

  return (
    <div className='App_minheight_login'>
      <br />
      <br />
      <h1>Administrador del Albergue</h1>
      <h2>Hospital del Niño Poblano</h2>
      
      <br/>
      
      <form className='login_table' onSubmit={handleSubmit}>
          <div><img src={logohnp} className="login_header_logo" alt="logo"/></div>
          <h3>¡Te damos la bienvenida!</h3>
          <p className='universal_text_error'>{loginErrorMessage}</p>
          <input value={nombre_u} onChange={(e)=>setUsername(e.target.value)} className="login_inputs universal_limit_input" type="text"  minLength="8" maxLength="16" onKeyPress={(e) => e.charCode === 32 && e.preventDefault()} placeholder="Usuario"></input>
          <br/>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="login_inputs universal_limit_input" type="password"  minLength="8" maxLength="16" onKeyPress={(e) => e.charCode === 32 && e.preventDefault()} placeholder="Contraseña"></input>
          <br/>
          <button className="login_inputs App_buttonaccept universal_limit_input">Iniciar sesión </button>
      </form>

    </div>
  )
}

export default LoginAdmin
