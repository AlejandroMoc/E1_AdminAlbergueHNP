//Inicio de Sesión

// Components
import Footer from '../universal/Footer';
import LoginAdmin from "../admins/LoginAdmin";

const Login = () => {
	return (
		<div className="App_global App_background_picture">
			<LoginAdmin/>
			<Footer/>
		</div>
	);
};

export default Login;