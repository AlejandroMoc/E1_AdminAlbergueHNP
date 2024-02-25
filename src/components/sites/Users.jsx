//Pagina de usuarios

import React from "react";

//Importar componentes
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Users = () => {
	return (
		<div className="App-global">
			<Navbar/>
			{/* TODO crear banner */}
			<h1>Usuarios</h1>
			<Footer/>
		</div>
	);
};

export default Users;
