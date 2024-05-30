import React, {useEffect, useState } from 'react';
import "./Navbar.scss";
import {useAuth } from '../../auth/AuthProvider';
import {Link} from "react-router-dom";
import {FaUser} from "react-icons/fa";
import {Outlet } from 'react-router-dom';
import logohnp from '../../assets/vectors/logo_hnp.svg';

const Navbar = () => {
  //Para manejo de sesiones
  const id_u = useAuth().getUser().id_usuario
  const [adminInfo, setAdminInfo] = useState([])
  // console.log(id_u)

  //Llamada a la función para información de usuario
  useEffect(() => {
    fetch('http://10.50.91.88:8008/infouser', {
      method: 'POST',
      body: JSON.stringify({id_u: id_u}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    .then((res) => res.json())
    .then((adminInfo) => setAdminInfo(adminInfo))
    .catch((error) => console.error('Error fetching data:', error))
  }, [])

  // const [navToggle, setNavToggle] = useState(false);
  // const navHandler = () => {
  //     setNavToggle(prevData => !prevData);
  // }
  
  return ( 
    <>
      <nav className = "navbar d-flex flex-row">
        <ul className = "navbar_left">
          <div className = "navbar_logo"><Link to="/dashboard"><img src={logohnp} alt="logo"/></Link></div>
        </ul>
        <ul className ='navbar_right d-flex flex-row'>
          <div className='navbar_div_text'><Link className = 'navbar_text' to ="/usernew"> Registro </Link></div>
          <div className='navbar_div_text'><Link className = 'navbar_text' to ="/beds"> Camas </Link></div>
          <div className='navbar_div_text'><Link className = 'navbar_text' to ="/userlist"> Clientes </Link></div>
          <div className='navbar_div_text'><Link className = 'navbar_text' to ="/reports"> Reporte </Link></div>
          <div className='navbar_div_text'>{adminInfo.admin ? <Link className = 'navbar_text' to ="/adminnew"> N. Admin </Link> : ''}</div>
          <div className='navbar_div_text'><Link className = 'navbar_text' to ="/profile"> <FaUser/> </Link></div>
        </ul>
      </nav>
      <Outlet/>
    </>
  )
}

export default Navbar