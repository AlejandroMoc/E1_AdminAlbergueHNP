//Creación de usuarios
import React from "react";

//Importar componentes
import Footer from '../universal/Footer';
import UserNewAdmin from "../admins/UserNewAdmin";

const UserNew = () => {
	return (
		<div className="App_global">
			<UserNewAdmin/>
			<Footer/>
		</div>
	);
};

export default UserNew;
