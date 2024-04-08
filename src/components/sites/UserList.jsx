//Administracion de usuarios ya existentes
import React, { useState } from "react";

//Importar componentes
import Navbar from '../Universal/Navbar';
import Footer from '../Universal/Footer';
import Dropdown from "../Universal/Dropdown";
// import UserListAdmin from "../Admins/UserListAdmin";

const UserList = () => {
	const[selected, setSelected] = useState("Filtro");
	return (
		<div className="App-global">
			<Navbar/>
			{/* <h1>Administración de Usuarios</h1> */}
			{/* <UserListAdmin/> */}
			<Dropdown selected={selected} setSelected={setSelected}/>
			{/* <Footer/> */}
		</div>
	);
};

export default UserList;
