import React from "react";
import MenuBar from "../components/MenuBar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div>
      <MenuBar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
