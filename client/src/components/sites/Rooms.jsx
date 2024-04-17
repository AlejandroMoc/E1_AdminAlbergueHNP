//Pagina de habitaciones

import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
//import Footer from '../Universal/Footer';
import RoomAdmin from "../Admins/RoomAdmin";

const Rooms = () => {
	return (
		<div className="App-global">
			<Navbar/>
			<RoomAdmin/>
			{/*<Footer/> */}
		</div>
	);
};

export default Rooms;
