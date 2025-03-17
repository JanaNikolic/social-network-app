import { Outlet, Navigate } from "react-router-dom";

const LoggedInUserGuard = () => {
  let token;
  
  try {
    token = localStorage.getItem("token");
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return !token ? <Outlet /> : <Navigate to="/home" />;
};

export default LoggedInUserGuard;
