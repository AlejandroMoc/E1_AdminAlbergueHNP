//Inicio de Sesión
import React from "react";

//Importar componentes
//import Navbar from '../universal/Navbar';
import Footer from '../universal/Footer';
import LoginAdmin from "../admins/LoginAdmin";

const Login = () => {
	return (
		<div className="App_global App_background_picture">
			<LoginAdmin/>
			<Footer/>
		</div>
	);
};

export default Login;