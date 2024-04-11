import React from 'react';
import "./Navbar.scss";
import {Link} from "react-router-dom";
import {FaUser} from "react-icons/fa";
import logohnp from '../../assets/logos/logo_hnp.svg';

const Navbar = () => {
  // const [navToggle, setNavToggle] = useState(false);
  // const navHandler = () => {
  //     setNavToggle(prevData => !prevData);
  // }
  
  return ( 
    <nav class = "navbar">
        <ul class = "navbar-left">
          <div className="navbar-logo-div"><Link to="/"><img src={logohnp} className="navbar-logo-color" alt="logo"/></Link></div>
        </ul>
        <ul class ='navbar-right'>
          <Link class = 'navbar-text' to ="/beds"> Camas </Link>
          <Link class = 'navbar-text' to ="/usernew"> Nuevo Usuario </Link>
          <Link class = 'navbar-text' to ="/userlist"> Usuarios </Link>
          <Link class = 'navbar-text' to ="/reports"> Reporte </Link>
          <Link class = 'navbar-text' to ="/profile"> <FaUser/> </Link>
        </ul>
    </nav>
  )
}

export default Navbar