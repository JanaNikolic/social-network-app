import { Outlet, Navigate } from "react-router-dom";

const LoggedInUserGuard = () => {
  const token = localStorage.getItem("token");
    
  return !token ? <Outlet /> : <Navigate to="/home" />;
};
export default LoggedInUserGuard;
