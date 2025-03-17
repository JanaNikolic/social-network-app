import { useEffect, useState, useCallback } from "react";
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
import { UserResponse } from "../interfaces/user.interfaces";
import { PostResponse } from "../interfaces/post.interfaces";

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [reloadPosts, setReloadPosts] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const fetchUserData = useCallback(async () => {
    if (!userId) {
      handleError("Page not found");
      return;
    }
    try {
      const [userDataResponse, profilePictureResponse] = await Promise.all([
        userService.fetchUserById(userId),
        userService.fetchProfilePicture(userId),
      ]);

      setUserData(userDataResponse);
      setProfilePicture(profilePictureResponse);
    } catch (error: unknown) {
      handleError(error instanceof Error ? error.message : "An error occurred");
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChangeRequest = () => {
    setReloadPosts(true);
    setUserData((prevUser) => prevUser ? { ...prevUser, isFriend: true } : prevUser);
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "primary.white" }}>
      {userData ? (
        <Box>
          <Box display="flex" flexDirection="row" alignItems="center" mt={4} p={4}>
            <Avatar
              alt={`${userData.name} ${userData.lastname}`}
              src={profilePicture ?? ""}
              sx={{ width: 100, height: 100 }}
            />
            <Box display="flex" flexDirection="column" ml={4} flexGrow={1}>
              <Typography variant="h5" mt={2}>
                {userData.name} {userData.lastname}
              </Typography>
              <Typography variant="body1">@{userData.username}</Typography>
            </Box>
            <FriendRequestButton userData={userData} onChangeRequest={handleChangeRequest} />
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" p={4} pt={0}>
            <Divider sx={{ width: "100%", mb: 2 }} />

            <PostsComponent
              profilePicture={profilePicture ?? ""}
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
              profileUserId={Number(userId)}
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
        <Typography
          sx={{
            margin: "auto",
            textAlign: "center",
            height: "100%",
            padding: "20vh",
          }}
        >
          Loading...
        </Typography>
      )}
    </Container>
  );
};

export default UserProfilePage;
