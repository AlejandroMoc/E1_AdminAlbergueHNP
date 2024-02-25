//Pagina de habitaciones

import React from "react";

//Importar componentes
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Rooms = () => {
	return (
		<div className="App-global">
			<Navbar/>
			{/* TODO crear banner */}
			<h1>Habitaciones</h1>
			<Footer/>
		</div>
	);
};

export default Rooms;
