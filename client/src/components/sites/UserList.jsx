//Administracion de usuarios ya existentes
import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import UserListAdmin from "../Admins/UserListAdmin";

const UserList = () => {
	return (
		<div className="App_global">
			<Navbar/>
			<UserListAdmin/>
			<Footer/>
		</div>
	);
};

export default UserList;