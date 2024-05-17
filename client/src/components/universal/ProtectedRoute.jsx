import {Outlet, Navigate} from "react-router-dom";
import {useAuth } from "../../auth/AuthProvider";

export const ProtectedRoute = () => {

    const auth = useAuth();
    console.log('AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
    console.log('Está autenticado?',auth.isAuthenticated);

    // return auth.isAuthenticated? <Outlet/> : <Navigate to="/login"/>
    return auth.isAuthenticated ? (     
        <>
          {console.log("Sí está autenticado. Entonces se va al Outlet...")}
          <Outlet/>
        </>
      ) : (
        <Navigate to="/login" onBeforeNavigate={() => console.log("Navegando to login...")} />
      );
};