import React from "react";

//Importar componentes
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
const Home = () => {
	return (
		<div className="App-global">
			<Navbar/>
			<Header/>
			<Footer/>
		</div>
	);
};

export default Home;