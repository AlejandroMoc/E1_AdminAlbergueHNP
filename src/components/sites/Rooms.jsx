//Pagina de habitaciones

import React from "react";

//Importar componentes
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Roomadmin from "../Admins/Roomadmin";

const Rooms = () => {
	return (
		<div className="App-global">
			<Navbar/>
			{/* TODO crear banner */}
			<Roomadmin/>
			<Footer/>
		</div>
	);
};

export default Rooms;
