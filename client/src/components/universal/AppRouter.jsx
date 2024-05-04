
import {
	// BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

//Importar páginas
import Home from "../sites/Home";
import UserNew from "../sites/UserNew";
import Rooms from "../sites/Rooms";
import UserList from "../sites/UserList";
import Profile from "../sites/Profile";
import ProfilePassword from "../sites/ProfilePassword";
import Reports from "../sites/Reports";
import Login from "../sites/Login";
import InfoUser from "../sites/InfoUser";
import Navbar from "./Navbar";

export const AppRouter = () => {
    return (
        <>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="*"
                    element={<Navigate to="/login" />}
                />

                <Route path='/' element = {<Navbar/>}>
                    <Route exact path="/" element={<Home />}/>
                    <Route path="usernew" element={<UserNew />} />
                    <Route path="infouser/:id_cliente" element={<InfoUser/>}/>
                    <Route path="infouser" element={<InfoUser />}/>
                    <Route path="userlist" element={<UserList />}/>
                    <Route path="beds" element={<Rooms />}/>
                    <Route path="profile" element={<Profile />}/>
                    <Route path="changepassword" element={<ProfilePassword />}/>
                    <Route path="reports" element={<Reports />}/>
                    <Route path="*" element={<Navigate to="/login" />}/>
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;