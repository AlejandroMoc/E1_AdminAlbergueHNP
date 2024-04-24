import React from "react";

//Importar componentes
import InfoUserAdmin from '../Admins/InfoUserAdmin';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar';

const InfoUser = () => {
	return (
		<div class="App_global">
			<Navbar/>
			<InfoUserAdmin/>
			<Footer/>
		</div>
	);
};

export default InfoUser;