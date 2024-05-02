import React from "react";

//Importar componentes
import HomeAdmin from '../Admins/HomeAdmin';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar';

const Home = () => {
	return (
		<div className="App_global App_background_blue">
			<Navbar/>
			<HomeAdmin/>
			<Footer/>
		</div>
	);
};

export default Home;