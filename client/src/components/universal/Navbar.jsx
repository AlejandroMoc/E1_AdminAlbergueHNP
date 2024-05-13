import React from 'react';
import "./Navbar.scss";
import {Link} from "react-router-dom";
import {FaUser} from "react-icons/fa";
import logohnp from '../../assets/vectors/logo_hnp.svg';
import { Outlet } from 'react-router-dom';

const Navbar = () => {
  // const [navToggle, setNavToggle] = useState(false);
  // const navHandler = () => {
  //     setNavToggle(prevData => !prevData);
  // }
  
  return ( 
    <>
        <nav className = "navbar">
        <ul className = "navbar_left">
          <div className = "navbar_divisor_logo"><Link to="/dashboard"><img src={logohnp} className="navbar_color_logo" alt="logo"/></Link></div>
        </ul>
        <ul className ='navbar_right'>
          <Link className = 'navbar_text' to ="/usernew"> Registro </Link>
          <Link className = 'navbar_text' to ="/beds"> Camas </Link>
          <Link className = 'navbar_text' to ="/userlist"> Clientes </Link>
          <Link className = 'navbar_text' to ="/reports"> Reporte </Link>
          <Link className = 'navbar_text' to ="/profile"> <FaUser/> </Link>
        </ul>
      </nav>
      <Outlet/>
    </>
  )
}

export default Navbar