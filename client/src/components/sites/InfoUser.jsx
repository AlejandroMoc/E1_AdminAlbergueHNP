import React from "react";

//Importar componentes
import InfoUserAdmin from '../Admins/InfoUserAdmin';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar';
//PARAMETROS PARA LEER INFO
import { useParams } from "react-router-dom";



const InfoUser = () => {
	const{id_cliente} = useParams();
	return (
		<div className="App-global">
			<Navbar/>
			<InfoUserAdmin id_cliente={id_cliente}/>
			<Footer/>
		</div>
	);
};
//GG
export default InfoUser;