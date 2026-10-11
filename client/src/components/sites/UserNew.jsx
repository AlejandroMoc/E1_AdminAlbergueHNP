//Creación de usuarios

// React
import {useParams } from "react-router-dom";

// Components
import Footer from '../universal/Footer';
import UserNewAdmin from "../admins/UserNewAdmin";

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
