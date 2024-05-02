//Inicio de Sesión
import React from "react";

//Importar componentes
//import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import LoginAdmin from "../Admins/LoginAdmin";

const Login = () => {
	return (
		<div className="App_global App_background_picture">
			<LoginAdmin/>
			<Footer/>
		</div>
	);
};

export default Login;