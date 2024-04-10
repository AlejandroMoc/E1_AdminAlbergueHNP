//Generacion de reportes
import React from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import ReportsAdmin from "../Admins/ReportsAdmin";

const Reports = () => {
	return (
		<div class="App-global">
			<Navbar/>
			<ReportsAdmin/>
			<Footer/>
		</div>
	);
};

export default Reports;