//Importar CSS y elementos correspondientes
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

//Importar páginas
import Home from "./components/sites/Home";
import UserNew from "./components/sites/UserNew";
import Rooms from "./components/sites/Rooms";
import UserList from "./components/sites/UserList";
import Profile from "./components/sites/Profile";
import ProfilePassword from "./components/sites/ProfilePassword";
import Reports from "./components/sites/Reports";
import Login from "./components/sites/Login";
import InfoUser from "./components/sites/InfoUser";

//Dibujar elementos
function App() {
	return (
		<>
			{/*Definir rutas*/}
			<Router>
				<Routes>
					<Route
						exact
						path="/"
						element={<Home />}
					/>
					<Route
						path="/usernew"
						element={<UserNew />}
					/>
					<Route
						path="/infouser/:id_cliente"
						element={<InfoUser/>}
					/>
					<Route
						path="/infouser"
						element={<InfoUser />}
					/>
          			<Route
						path="/userlist"
						element={<UserList />}
					/>
					<Route
						path="/beds"
						element={<Rooms />}
					/>
          			<Route
						path="/profile"
						element={<Profile />}
					/>
					<Route
						path="/changepassword"
						element={<ProfilePassword />}
					/>
          			<Route
						path="/reports"
						element={<Reports />}
					/>
					<Route
						path="/login"
						element={<Login />}
					/>
					{/*Si la ruta falla, redirigir a / (Home)*/}
					{/*TODO ver si meterle un 404*/}
					<Route
						path="*"
						element={<Navigate to="/" />}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;