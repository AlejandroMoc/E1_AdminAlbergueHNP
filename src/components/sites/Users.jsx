//Pagina de usuarios

import React from "react";

//Importar componentes
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Useradmin from "../Admins/Useradmin";

const Users = () => {
	return (
		<div className="App-global">
			<Navbar/>
			{/* TODO crear banner */}
			<Useradmin/>
			<Footer/>
		</div>
	);
};

export default Users;
