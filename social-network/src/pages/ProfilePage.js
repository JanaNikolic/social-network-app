import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Snackbar,
  Button,
  Divider,
  Badge,
} from "@mui/material";
import userService from "../services/UserService";
import postService from "../services/PostService";
import Post from "../components/Post";
import PostForm from "../components/PostForm";
import jwtUtils from "../utils/jwtUtils";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EditProfilePictureDialog from "../components/EditProfilePictureDialog";
import EditProfileInfoDialog from "../components/edit-profile/EditProfileInfoDialog";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isEditPictureDialogOpen, setEditPictureDialogOpen] = useState(false);
  const [isEditInfoDialogOpen, setEditInfoDialogOpen] = useState(false);

  const handleEditInfo = () => {
    setEditInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setEditInfoDialogOpen(false);
  };

  const handleEditInfoSubmit = (updatedUser, message) => {
    if (updatedUser) {
      setUserData((prevData) => ({
        ...prevData,
        name: updatedUser.name,
        lastname: updatedUser.lastname,
        username: updatedUser.username,
      }));
    }

    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  
  const handleEditProfilePhoto = () => {
    setEditPictureDialogOpen(true);
  };

  const handleClosePictureDialog = (profilePicture, message) => {
    if (profilePicture) setProfilePicture(URL.createObjectURL(profilePicture));
    setEditPictureDialogOpen(false);

    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePostFormOpen = () => {
    setIsPostFormOpen(true);
  };

  const handlePostFormClose = () => {
    setIsPostFormOpen(false);
  };

  const handlePostSubmit = (post, message) => {
    if (post) {
      post.postedBy = userData;

      setPosts((prevPosts) => [post, ...prevPosts]);
    }

    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.fetchUserData();
        setUserData(data);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };

    const fetchProfilePicture = async () => {
      try {
        const userId = jwtUtils.getIdFromToken();
        const data = await userService.fetchProfilePicture(userId);
        setProfilePicture(data);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };
    fetchUserData();
    fetchProfilePicture();
    fetchPosts(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          fetchPosts(page);
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector("#scroll-anchor");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [page, loadingMore, hasMore]);

  const fetchPosts = async (page) => {
    try {
      const data = await postService.fetchPostsForLogedInUser(page, 4);
      if (data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!userData || !profilePicture) {
    return (
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
    );
  }

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "primary.white" }}>
      <Box display="flex" flexDirection="row" alignItems="center" mt={4} p={4}>
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <IconButton
              aria-label="edit profile picture"
              onClick={handleEditProfilePhoto}
              sx={{
                backgroundColor: "secondary.main",
                "&:hover": {
                  backgroundColor: "rgba(194, 148, 138, 0.8)",
                },
              }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          }
        >
          <Avatar
            alt={`${userData.name} ${userData.lastname}`}
            src={profilePicture}
            sx={{ width: 100, height: 100 }}
          />
        </Badge>
        <Box display="flex" flexDirection="column" ml={4} flexGrow={1}>
          <Typography variant="h5" mt={2}>
            {userData.name} {userData.lastname}
          </Typography>
          <Typography variant="body1">@{userData.username}</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostFormOpen}
          >
            Add Post
          </Button>
          <Button variant="contained" color="secondary" sx={{ mx: 2 }} onClick={handleEditInfo}>
            Edit Profile
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        pt={0}
      >
        <Divider sx={{ width: "100%", mb: 2 }} />
        <Box>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                userId={userData.id}
                username={post.postedBy.username}
                content={post.content}
                isLiked={post.isLiked}
                numOfLikes={post.numOfLikes}
                numOfComments={post.numOfComments}
                createdAt={post.createdAt}
                profilePicture={profilePicture}
              />
            ))
          ) : (
            <Typography>No posts to display.</Typography>
          )}
          <div id="scroll-anchor" style={{ height: "20px" }} />
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      <PostForm
        open={isPostFormOpen}
        handleClose={handlePostFormClose}
        handlePostSubmit={handlePostSubmit}
      />
      <EditProfilePictureDialog
        open={isEditPictureDialogOpen}
        onClose={handleClosePictureDialog}
      />
      <EditProfileInfoDialog
        open={isEditInfoDialogOpen}
        handleClose={handleCloseInfoDialog}
        handleEditInfoSubmit={handleEditInfoSubmit}
        user={userData}
      />
    </Container>
  );
};

export default ProfilePage;
