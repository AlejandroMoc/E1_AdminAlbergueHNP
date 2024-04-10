//Pagina de administración de perfil
import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import ProfilePasswordAdmin from "../Admins/ProfilePasswordAdmin";

const ProfilePassword = () => {
	return (
		<div class="App-global App-bluebackground">
			<Navbar/>
			<ProfilePasswordAdmin/>
			<Footer/>
		</div>
	);
};

export default ProfilePassword;