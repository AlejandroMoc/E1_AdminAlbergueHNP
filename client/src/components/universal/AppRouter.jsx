// React
import {Routes, Route, Navigate} from "react-router-dom";

// Components
import EditUser from "../sites/EditUser";
import Home from "../sites/Home";
import UserNew from "../sites/UserNew";
import Rooms from "../sites/Rooms";
import UserList from "../sites/UserList";
import Profile from "../sites/Profile";
import ProfilePassword from "../sites/ProfilePassword";
import Reports from "../sites/Reports";
import Login from "../sites/Login";
import SignUp from "../sites/SignUp";
import InfoUser from "../sites/InfoUser";
import Navbar from "./Navbar";
import {ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
    // //Vacía información

    //Solucion que parece que vamos a tener que usar
    //Cada que recargas la pagina se sale la sesion

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />}/>
                {/* TODO mover SIGNUP a ProtectedRoute */}
                <Route path="/signup" element={<SignUp />}/>
                
                <Route path = "/" element = {<ProtectedRoute/>}>
                    <Route element = {<Navbar/>}>
                        <Route exact path="/dashboard" element={<Home />}/>
                        <Route path="/usernew" element={<UserNew />} />
                        <Route path="/usernew/:id_cama" element={<UserNew />} /> 
                        <Route path="/adminnew" element={<SignUp />} />
                        <Route path="/infouser/:id_cliente" element={<InfoUser/>}/>
                        <Route path="/userlist" element={<UserList />}/>
                        <Route path="/beds" element={<Rooms />}/>
                        <Route path="/profile" element={<Profile />}/>
                        <Route path="/changepassword" element={<ProfilePassword />}/>
                        <Route path="/reports" element={<Reports />}/>
                        <Route path="/edituser/:id_cliente" element={<EditUser/>}/>
                        
                        {/* TODO crear 404? */}
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" />}/>
                
            </Routes>
        </>
    );
};

export default AppRouter;
