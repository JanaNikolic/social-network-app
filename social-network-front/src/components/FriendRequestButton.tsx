import { FC, useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem, Snackbar } from "@mui/material";
import friendService from "../services/FriendService";
import { RequestResponse } from "../interfaces/request.interfaces";
import { UserResponse } from "../interfaces/user.interfaces";

interface ButtonProps {
  userData: UserResponse;
  onChangeRequest: () => void;
}

const FriendRequestButton: FC<ButtonProps> = ({ userData, onChangeRequest }) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [request, setRequest] = useState<RequestResponse | null>(null);

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const data = await friendService.getFriendRequestsByUserId(userData.id);
        setRequest(data);
      } catch (err: any) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };

    fetchFriendRequest();
  }, [userData]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAcceptRequest = async () => {
    try {
      const data = await friendService.acceptFriendRequest(userData.id);
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
      onChangeRequest();
      setRequest((prevRequest) =>
        prevRequest ? { ...prevRequest, status: "ACCEPTED" } : null
      );
      handleMenuClose();
    } catch (err: any) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const data = await friendService.rejectFriendRequest(userData.id);
      console.log("Snackbar message:", data.message);
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
      setRequest(null);
      handleMenuClose();
    } catch (err: any) {
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
    } catch (err: any) {
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
