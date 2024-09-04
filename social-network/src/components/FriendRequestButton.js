import React, { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem, Snackbar } from "@mui/material";
import friendService from "../services/FriendService";

const FriendRequestButton = ({ userData, onChangeRequest }) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const data = await friendService.getFriendRequestsByUserId(userData.id);
        setRequest(data);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };

    fetchFriendRequest();
  }, [userData]);

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
      onChangeRequest();
      setRequest((prevRequest) => ({ ...prevRequest, status: "ACCEPTED" }));
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
      onChangeRequest();
      setRequest(null);
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleSendRequest = async () => {
    try {
      const data = await friendService.sendFriendRequest(userData.id);
      setSnackbarMessage("Friend request sent");
      setSnackbarOpen(true);
      setRequest(data);
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" mt={4} p={4}>
      {request ? (
        <Box>
          <Box ml="auto">
            {request.status === "PENDING" && userData.id === request.senderId ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleMenuOpen}
              >
                Respond
              </Button>
            ) : request.status === "PENDING" &&
              userData.id === request.receiverId ? (
              <Button variant="contained" color="secondary">
                Request Sent
              </Button>
            ) : request.status === "ACCEPTED" || userData.isFriend ? (
              <Button variant="contained" color="primary">
                Friend
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendRequest}
              >
                Add Friend
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
      ) : (
        <Button variant="contained" color="primary" onClick={handleSendRequest}>
          Add Friend
        </Button>
      )}
    </Box>
  );
};

export default FriendRequestButton;
