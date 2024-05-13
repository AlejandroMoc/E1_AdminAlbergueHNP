//Administracion de usuarios ya existentes
import React from "react";

//Importar componentes
import Footer from '../universal/Footer';
import UserListAdmin from "../admins/UserListAdmin";

const UserList = () => {
	return (
		<div className="App_global">
			<UserListAdmin/>
			<Footer/>
		</div>
	);
};

export default UserList;
