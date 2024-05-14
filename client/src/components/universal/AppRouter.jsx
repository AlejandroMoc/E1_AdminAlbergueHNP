
import { Routes, Route, Navigate} from "react-router-dom";
import React, { useEffect } from 'react';

//Importar páginas
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
import { useAuth } from '../../auth/AuthProvider';
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
    // //Vacía información
    const auth = useAuth();

    // const handleSignOut = async () => {
    //     try {
    //     const response = await fetch('http://localhost:8000/signout/', {
    //         method: 'DELETE',
    //         headers: {
    //         'Content-type': 'application/json; charset=UTF-8',
    //         Authorization: `Bearer ${auth.getRefreshToken()}`,
    //         },
    //     });

    //     if (response.ok) {
    //         auth.signOut();
    //     } else {
    //         console.error('Sign out failed');
    //     }
    //     } catch (error) {
    //     console.error('Error during sign out:', error);
    //     }
    // };

    // useEffect(() => {
    //     handleSignOut();
    // }, []);

    return (
        <>
            <Routes>

                <Route path="/login" element={<Login />}/>
                {/* TODO borrar antes de versión final */}
                <Route path="/signup" element={<SignUp />}/>
                <Route path="*" element={<Navigate to="/login" />}/>

                <Route path = "/" element = {<ProtectedRoute/>}>
                    <Route element = {<Navbar/>}>
                        <Route exact path="dashboard" element={<Home />}/>
                        <Route path="usernew" element={<UserNew />} />
                        <Route path="infouser/:id_cliente" element={<InfoUser/>}/>
                        <Route path="infouser" element={<InfoUser />}/>
                        <Route path="userlist" element={<UserList />}/>
                        <Route path="beds" element={<Rooms />}/>
                        <Route path="profile" element={<Profile />}/>
                        <Route path="changepassword" element={<ProfilePassword />}/>
                        <Route path="reports" element={<Reports />}/>
                        {/* TODO crear 404? */}
                        {/* <Route path="*" element={<Navigate to="/login" />}/> */}
                    </Route>
                </Route>
                
            </Routes>
        </>
    );
};

export default AppRouter;