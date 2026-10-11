// React
import { useState } from 'react';
import { Form } from 'react-bootstrap';

// Components
import MyToastContainer, { successToast, errorToast } from '../universal/MyToast';
import { API_URL } from '../../App';

// CSS
import "./LoginAdmin.scss";

// Icons
import logohnp from '../../assets/vectors/logo_hnp.svg';

const SignUpAdmin = () => {
  const [username, setUsername] = useState("");
  const usernameChange = (event) => {
    setUsername(event.target.value)
    setErrorMessage('')
  }

  const [password, setPassword] = useState("");
  const passwordChange = (event) => {
    setPassword(event.target.value)
    setErrorMessage('')
  }

  const [isAdmin, setIsAdmin] = useState(false);

  //Mensaje de error
  const [ErrorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('ALERTA: Se deben ingresar los campos.');
    }
    else if (username === password) {
      setErrorMessage('ALERTA: Los campos no pueden ser iguales.');
    }
    else {
      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            username,
            password,
            isAdmin
          })
        });

        if (response.ok) {
          setUsername('')
          setPassword('')
          successToast()
        } else {
          setErrorMessage('Usuario Existente');
          errorToast()
        }
      } catch (error) {
        errorToast()
      }
    }


  }

  return (
    <div className=' login_padding_form'>

      <form className='login_table' onSubmit={handleSubmit}>
        <div><img src={logohnp} className="login_header_logo" alt="logo" /></div>

        <h3>Crear un administrador</h3>

        <div><input value={username} onChange={(e) => usernameChange(e)} className="login_inputs universal_limit_input" type="text" minLength="8" maxLength="16" placeholder="Usuario" onKeyPress="return event.charCode != 32"></input></div>
        <div><input value={password} onChange={(e) => passwordChange(e)} className="login_inputs universal_limit_input" type="password" minLength="8" maxLength="16" placeholder="Contraseña" onKeyPress="return event.charCode != 32"></input></div>
        
        <p className='universal_text_error'>{ErrorMessage}</p>

        <Form.Check
          className='login_checkbox_admin'
          type='checkbox'
          id='isAdmin'
          label=' Permisos de edición'
          checked={isAdmin}
          onChange={() => setIsAdmin(prevIsAdmin => !prevIsAdmin)}
        />

        <button className="login_inputs App_buttonaccept">Registrar</button>
      </form>
      <MyToastContainer />

    </div>
  )
}

export default SignUpAdmin
