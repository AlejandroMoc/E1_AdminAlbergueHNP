//Generacion de reportes
import React from "react";

//Importar componentes
import Footer from '../universal/Footer';
import ReportsAdmin from "../admins/ReportsAdmin";

const Reports = () => {
	return (
		<div className="App_global">
			<ReportsAdmin/>
			<Footer/>
		</div>
	);
};

export default Reports;