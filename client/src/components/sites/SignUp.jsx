//Inicio de Sesión
import React from "react";

//Importar componentes
import Footer from '../universal/Footer';
import SignUpAdmin from "../admins/SignUpAdmin";

const SignUp = () => {
	return (
		<div className="App_global App_background_picture">
			<SignUpAdmin/>
			<Footer/>
		</div>
	);
};

export default SignUp;