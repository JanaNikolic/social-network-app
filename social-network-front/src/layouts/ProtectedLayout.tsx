import MenuBar from "../components/navigation/MenuBar";
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
