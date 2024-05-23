//Creación de usuarios
import React from "react";

//Importar componentes
import Footer from '../universal/Footer';
import UserNewAdmin from "../admins/UserNewAdmin";
import {useParams } from "react-router-dom";

const UserNew = () => {
	const{id_cama} = useParams();
	return (
		<div className="App_global">
			<UserNewAdmin id_cama={id_cama}/>
			<Footer/>
		</div>
	);
};

export default UserNew;
