import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { Home as HomeIcon, AccountCircle as AccountCircleIcon, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SearchBarWithDropdown from "./SearchBarWithDropdown";

const MenuBar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleProfileClick = () => {
    navigate("/account/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <SearchBarWithDropdown />
        </Box>
        <IconButton edge="end" sx={{mx: 2}} onClick={handleHomeClick}>
          <HomeIcon sx={{ color: "primary.dark" }} />
        </IconButton>
        <IconButton edge="end" color="inherit" sx={{mx: 2}} onClick={handleProfileClick}>
          <AccountCircleIcon sx={{ color: "primary.dark" }} />
        </IconButton>
        <IconButton edge="end" color="inherit" sx={{mx: 2}} onClick={handleLogout}>
          <Logout sx={{ color: "primary.dark" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
