//Inicio de Sesión
import React from "react";

//Importar componentes
//import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import SignupAdmin from "../Admins/SignupAdmin";

const Signup = () => {
	return (
		<div class="App-global App-bluebackground2">
			<SignupAdmin/>
			<Footer/>
		</div>
	);
};

export default Signup;