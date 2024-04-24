//Pagina de administración de perfil
import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import ProfilePasswordAdmin from "../Admins/ProfilePasswordAdmin";

const ProfilePassword = () => {
	return (
		<div className="App_global App_background_blue">
			<Navbar/>
			<ProfilePasswordAdmin/>
			<Footer/>
		</div>
	);
};

export default ProfilePassword;