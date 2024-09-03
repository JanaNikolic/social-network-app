import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  Card,
  Button,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import userService from "../services/UserService";
import friendService from "../services/FriendService";

const FriendRequestCard = ({ user, onRemoveRequest }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const data = await userService.fetchProfilePicture(user.id);
        setProfilePicture(data);
      } catch (err) {}
    };
    fetchProfilePicture();
  }, [user.id]);

  const handleAcceptRequest = async () => {
    try {
      await friendService.acceptFriendRequest(user.id);
      onRemoveRequest(user.id, true);
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await friendService.rejectFriendRequest(user.id);
      onRemoveRequest(user.id, false);
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Card
      sx={{
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        mb: 2,
        width: "45%",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="left">
        <Avatar
          src={profilePicture}
          alt={user.username}
          sx={{ width: 50, height: 50, mr: 2 }}
        />
        <Box display="flex" alignItems="left" flexDirection="column" mr={2}>
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "18rem",
            }}
            noWrap
          >
            {`${user.name} ${user.lastname}`}
          </Typography>
          <Typography variant="body1">@{user.username}</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleMenuOpen}>
          Respond
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleAcceptRequest}>Confirm</MenuItem>
          <MenuItem onClick={handleDeleteRequest}>Delete</MenuItem>
        </Menu>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Card>
  );
};
export default FriendRequestCard;
