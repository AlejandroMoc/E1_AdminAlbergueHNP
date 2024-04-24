//Pagina de administración de perfil
import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import ProfileAdmin from "../Admins/ProfileAdmin";

const Profile = () => {
	return (
		<div className="App_global App_background_blue">
			<Navbar/>
			<ProfileAdmin/>
			<Footer/>
		</div>
	);
};

export default Profile;