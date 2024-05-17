import React from "react";

//Importar componentes
import EditUserAdmin from '../admins/EditUserAdmin';
import Footer from '../universal/Footer';
import {useParams } from "react-router-dom";

const EditUser = () => {
	const{id_cliente} = useParams();
	return (
		<div className="App_global">
			<EditUserAdmin id_cliente={id_cliente}/>
			<Footer/>
		</div>
	);
};
//GG
export default EditUser;