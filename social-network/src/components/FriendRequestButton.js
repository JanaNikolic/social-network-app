import React, { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem, Snackbar } from "@mui/material";
import friendService from "../services/FriendService";

const FriendRequestButton = (userData) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAcceptRequest = async () => {
    try {
      await friendService.acceptFriendRequest(userData.id);
      setSnackbarMessage("Friend request accepted");
      setSnackbarOpen(true);
      //   setUserData({ ...userData, friendStatus: "ACCEPTED", isFriend: true });
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await friendService.rejectFriendRequest(userData.id);
      setSnackbarMessage("Friend request rejected");
      setSnackbarOpen(true);
      //   setUserData({ ...userData, friendStatus: "none", isFriend: false });
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleSendRequest = async () => {
    try {
      await friendService.sendFriendRequest(userData.id);
      setSnackbarMessage("Friend request sent");
      setSnackbarOpen(true);
      //   setUserData({ ...userData, friendStatus: "PENDING" });
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" mt={4} p={4}>
      <Box ml="auto">
        {userData.friendStatus === "PENDING" && userData.isFriend === false ? (
          <Button variant="contained" color="primary" onClick={handleMenuOpen}>
            Respond
          </Button>
        ) : userData.friendStatus === "NONE" ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSendRequest}
          >
            Add Friend
          </Button>
        ) : userData.friendStatus === "PENDING" ? (
          <Button variant="contained" color="secondary">
            Request Sent
          </Button>
        ) : (
          <Button variant="contained" color="primary">
            Friend
          </Button>
        )}
      </Box>
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
    </Box>
  );
};

export default FriendRequestButton;
