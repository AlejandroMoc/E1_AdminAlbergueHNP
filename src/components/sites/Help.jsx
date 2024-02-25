//Pagina de acerca de/ayuda

import React from "react";

//Importar componentes
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Help = () => {
	return (
		<div className="App-global">
			<Navbar/>
			{/* TODO crear banner */}
			<h1>Acerca de</h1>
			<Footer/>
		</div>
	);
};

export default Help;
