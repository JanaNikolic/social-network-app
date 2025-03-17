import { Outlet, Navigate } from "react-router-dom";
import jwtUtils from "./jwtUtils";


const ProtectedRoutes = () => {
    if (!jwtUtils.isTokenValid()) {
        jwtUtils.removeToken();
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
