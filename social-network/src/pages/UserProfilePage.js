import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Snackbar,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import userService from "../services/UserService";
import PostsComponent from "../components/PostsComponent";
import FriendRequestButton from "../components/FriendRequestButton";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [reloadPosts, setReloadPosts] = useState(false);

  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangeRequest = () => {
    setReloadPosts(true);
    setUserData({...userData, isFriend: true});
  };

  const fetchUserData = async () => {
    try {
      const data = await userService.fetchUserById(userId);
      setUserData(data);
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const data = await userService.fetchProfilePicture(userId);
        setProfilePicture(data);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };
    fetchUserData();
    fetchProfilePicture();
  }, [userId]);


  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "primary.white" }}>
      {userData ? (
        <Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            mt={4}
            p={4}
          >
            <Avatar
              alt={`${userData.name} ${userData.lastname}`}
              src={profilePicture}
              sx={{ width: 100, height: 100 }}
            />
            <Box display="flex" flexDirection="column" ml={4} flexGrow={1}>
              <Typography variant="h5" mt={2}>
                {userData.name} {userData.lastname}
              </Typography>
              <Typography variant="body1">@{userData.username}</Typography>
            </Box>
            <FriendRequestButton userData={userData} onChangeRequest={handleChangeRequest}/>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={4}
            pt={0}
          >
            <Divider sx={{ width: "100%", mb: 2 }} />

            <PostsComponent
              profilePicture={profilePicture}
              posts={posts}
              setPosts={setPosts}
              page={page}
              setPage={setPage}
              loadingMore={loadingMore}
              setLoadingMore={setLoadingMore}
              hasMore={hasMore}
              setHasMore={setHasMore}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarOpen={setSnackbarOpen}
              profileUserId={userId}
              isFriend={userData.isFriend}
              reloadPosts={reloadPosts}
              setReloadPosts={setReloadPosts}
            />
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
          />
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
};
export default UserProfilePage;
