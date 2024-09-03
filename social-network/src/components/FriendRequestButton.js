import React, { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem, Snackbar } from "@mui/material";
import friendService from "../services/FriendService";

const FriendRequestButton = ({ userData, onChangeRequest }) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [request, setRequest] = useState(null);
  const [user, setUser] = useState(userData);

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const data = await friendService.getFriendRequestsByUserId(user.id);
        setRequest(data);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };
    fetchFriendRequest();
  }, [user]);

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
      await friendService.acceptFriendRequest(user.id);
      setSnackbarMessage("Friend request accepted");
      setSnackbarOpen(true);
      setUser({ ...user, isFriend: true });
      setRequest({ ...request, status: "ACCEPTED" });
      onChangeRequest();
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await friendService.rejectFriendRequest(user.id);
      setSnackbarMessage("Friend request rejected");
      setSnackbarOpen(true);
      setUser({ ...user, isFriend: false });
      setRequest(null);
      onChangeRequest();
      handleMenuClose();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleSendRequest = async () => {
    try {
      const data = await friendService.sendFriendRequest(user.id);
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
            {request.status === "PENDING" && user.id === request.senderId ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleMenuOpen}
              >
                Respond
              </Button>
            ) : request.status === "PENDING" &&
              user.id === request.receiverId ? (
              <Button variant="contained" color="secondary">
                Request Sent
              </Button>
            ) : request.status === "ACCEPTED" || user.isFriend ? (
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
