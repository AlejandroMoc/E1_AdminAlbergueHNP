import React, {useState} from 'react';
import "./Navbar.css";

const Navbar = () => {
    // const [navToggle, setNavToggle] = useState(false);
    // const navHandler = () => {
    //     setNavToggle(prevData => !prevData);
    // }
  return (

    //TODO escribir toda la navbar
    //verificar anchura    
    <nav className="navbar">
        <ul>
          <a className= 'navbar-text' href="#">Inicio</a>
          <a className= 'navbar-text' href="#">Salas</a>
          <a className= 'navbar-text' href="#">Usuarios</a>
          <a className= 'navbar-text' href="#">Acerca de</a>
        </ul>
    </nav>
  )
}

export default Navbar