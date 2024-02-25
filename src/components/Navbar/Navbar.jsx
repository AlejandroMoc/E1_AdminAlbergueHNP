import React from 'react';
import "./Navbar.css";
import {Link} from "react-router-dom";

const Navbar = () => {
    // const [navToggle, setNavToggle] = useState(false);
    // const navHandler = () => {
    //     setNavToggle(prevData => !prevData);
    // }
  return ( 
    <nav className="navbar">
        <ul>
          <Link className= 'navbar-text' to="/"> Inicio </Link>
          <Link className= 'navbar-text' to="/rooms"> Salas </Link>
          <Link className= 'navbar-text' to="/users"> Usuarios </Link>
          <Link className= 'navbar-text' to="/help"> Acerca de </Link>
        </ul>
    </nav>
  )
}

export default Navbar