import React from 'react';
import "./Navbar.css";
import {Link} from "react-router-dom";
import {FaUser} from "react-icons/fa";
import logohnp from '../../assets/logos/logo_hnp.svg';

const Navbar = () => {
  // const [navToggle, setNavToggle] = useState(false);
  // const navHandler = () => {
  //     setNavToggle(prevData => !prevData);
  // }
  
  return ( 
    <nav className = "navbar">
        <ul className = "navbar-left">
          <div className="navbar-logo-div"><Link to="/"><img src={logohnp} className="navbar-logo-color" alt="logo"/></Link></div>
        </ul>
        <ul className ='navbar-right'>
          <Link className = 'navbar-text' to ="/beds"> Camas </Link>
          <Link className = 'navbar-text' to ="/usernew"> Nuevo Usuario </Link>
          <Link className = 'navbar-text' to ="/userlist"> Usuarios </Link>
          <Link className = 'navbar-text' to ="/reports"> Reporte </Link>
          <Link className = 'navbar-text' to ="/profile"> <FaUser/> </Link>
        </ul>
    </nav>
  )
}

export default Navbar