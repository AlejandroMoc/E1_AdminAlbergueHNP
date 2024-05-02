//Creación de usuarios
import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import UserNewAdmin from "../Admins/UserNewAdmin";

const UserNew = () => {
	return (
		<div className="App_global">
			<Navbar/>
			<UserNewAdmin/>



			<Footer/>
		</div>
	);
};

export default UserNew;
