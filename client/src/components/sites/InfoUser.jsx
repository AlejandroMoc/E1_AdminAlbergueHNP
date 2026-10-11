// React
import {useParams } from "react-router-dom";

// Components
import InfoUserAdmin from '../admins/InfoUserAdmin';
import Footer from '../universal/Footer';

const InfoUser = () => {
	const{id_cliente} = useParams();
	return (
		<div className="App_global">
			<InfoUserAdmin id_cliente={id_cliente}/>
			<Footer/>
		</div>
	);
};
//GG
export default InfoUser;