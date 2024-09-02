import { Outlet, Navigate } from "react-router-dom";
import jwtDecode from 'jwt-decode';

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  
  let currentDate = new Date();
  let result = false;

  if (decodedToken.exp * 1000 >= currentDate.getTime()) {
    result = true;
  }

  return result ? <Outlet /> : <Navigate to="/login" />;
};
export default ProtectedRoutes;
