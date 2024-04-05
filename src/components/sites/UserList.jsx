//Administracion de usuarios ya existentes
import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import UserListAdmin from "../Admins/UserListAdmin";

const UserList = () => {
	return (
		<div className="App-global">
			<Navbar/>
			<my_Dropdown/>
			<UserListAdmin/>
			<Footer/>
		</div>
	);
};

export default UserList;
