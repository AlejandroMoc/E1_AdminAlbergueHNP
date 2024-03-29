import React from 'react';
import "./Navbar.css";
import {Link} from "react-router-dom";

//Importar iconos
import {FaUser} from "react-icons/fa";

const Navbar = () => {
  // const [navToggle, setNavToggle] = useState(false);
  // const navHandler = () => {
  //     setNavToggle(prevData => !prevData);
  // }
  
  return ( 
    <nav className="navbar">
        <ul>
          <Link className= 'navbar-text navbar-blacktext' to="/"> Inicio </Link>
          <Link className= 'navbar-text navbar-blacktext' to="/rooms"> Salas </Link>
          <Link className= 'navbar-text navbar-blacktext' to="/users"> Usuarios </Link>
          <Link className= 'navbar-text navbar-blacktext' to="/help"> Acerca de </Link>
        </ul>
        {/*Para usuarios*/}
        <ul className='navbar-right'>
          <Link className= 'navbar-text navbar-whitetext' to="/profile"> <FaUser/> </Link>
        </ul>
    </nav>
  )
}

export default Navbar