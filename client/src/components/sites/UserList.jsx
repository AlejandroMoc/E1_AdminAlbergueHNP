//Administracion de usuarios ya existentes

// Components
import Footer from '../universal/Footer';
import UserListAdmin from "../admins/UserListAdmin";

const UserList = () => {
	return (
		<div className="App_global">
			<UserListAdmin/>
			<Footer/>
		</div>
	);
};

export default UserList;
