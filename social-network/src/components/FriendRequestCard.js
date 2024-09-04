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
import { useNavigate } from "react-router-dom";

const FriendRequestCard = ({ user, onRemoveRequest }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
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

  const handleAcceptRequest = async (event) => {
    event.stopPropagation();
    try {
      await friendService.acceptFriendRequest(user.id);
      onRemoveRequest(user.id, true);
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteRequest = async (event) => {
    event.stopPropagation();
    try {
      await friendService.rejectFriendRequest(user.id);
      onRemoveRequest(user.id, false);
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <Card
      sx={{
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        mb: 2,
        width: "45%",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          src={profilePicture}
          alt={user.username}
          sx={{ width: 50, height: 50, mr: 2 }}
          onClick={handleCardClick}
        />
        <Box
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          mr={2}
          width="auto"
        >
          <Typography
            variant="body1"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            noWrap
            onClick={handleCardClick}
          >
            {`${user.name} ${user.lastname}`}
          </Typography>
          <Typography variant="body2">@{user.username}</Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMenuOpen}
        sx={{ marginLeft: "auto" }}
      >
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
