//Pagina de administración de perfil

// Components
import Footer from '../universal/Footer';
import ProfileAdmin from "../admins/ProfileAdmin";

const Profile = () => {
	return (
		<div className="App_global App_background_blue">
			<ProfileAdmin/>
			<Footer/>
		</div>
	);
};

export default Profile;