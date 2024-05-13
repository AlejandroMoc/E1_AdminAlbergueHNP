import React from "react";

//Importar componentes
import InfoUserAdmin from '../admins/InfoUserAdmin';
import Footer from '../universal/Footer';
import { useParams } from "react-router-dom";

const InfoUser = () => {
	const{id_cliente} = useParams();
	return (
		<div>
			<InfoUserAdmin id_cliente={id_cliente}/>
			<Footer/>
		</div>
	);
};
//GG
export default InfoUser;