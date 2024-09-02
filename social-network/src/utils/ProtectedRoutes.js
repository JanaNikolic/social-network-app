import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import jwtDecode from 'jwt-decode';

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentDate = new Date();

    if (decodedToken.exp * 1000 >= currentDate.getTime()) {
      return <Outlet />;
    } else {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
