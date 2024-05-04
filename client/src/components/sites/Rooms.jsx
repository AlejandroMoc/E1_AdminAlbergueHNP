//Pagina de habitaciones

import React from "react";

//Importar componentes
import Footer from '../universal/Footer';
import RoomAdmin from "../admins/RoomAdmin";

const Rooms = () => {
	return (
		<div className="App_global">
			<RoomAdmin/>
			<Footer/>
		</div>
	);
};

export default Rooms;
