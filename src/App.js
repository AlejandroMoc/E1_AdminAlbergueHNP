//Importar CSS y elementos correspondientes
import './App.css';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

//Importar páginas
import Home from "./components/sites/Home";
import Users from "./components/sites/Users";
import Rooms from "./components/sites/Rooms";
import Help from "./components/sites/Help";

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
						path="/users"
						element={<Users />}
					/>
					<Route
						path="/rooms"
						element={<Rooms />}
					/>
          			<Route
						path="/help"
						element={<Help />}
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