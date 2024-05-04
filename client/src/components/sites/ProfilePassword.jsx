//Pagina de administración de perfil
import React from "react";

//Importar componentes
import Footer from '../universal/Footer';
import ProfilePasswordAdmin from "../admins/ProfilePasswordAdmin";

const ProfilePassword = () => {
	return (
		<div className="App_global App_background_blue">
			<ProfilePasswordAdmin/>
			<Footer/>
		</div>
	);
};

export default ProfilePassword;