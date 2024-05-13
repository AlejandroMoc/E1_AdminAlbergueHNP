import React from "react";

//Importar componentes
import HomeAdmin from '../admins/HomeAdmin';
import Footer from '../universal/Footer';

const Home = () => {
	return (
		<div className="App_global App_background_blue">
			<HomeAdmin/>
			<Footer/>
		</div>
	);
};

export default Home;