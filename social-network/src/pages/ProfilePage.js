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
  Tab,
  Tabs,
} from "@mui/material";
import userService from "../services/UserService";
import PostForm from "../components/PostForm";
import jwtUtils from "../utils/jwtUtils";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EditProfilePictureDialog from "../components/EditProfilePictureDialog";
import EditProfileInfoDialog from "../components/edit-profile/EditProfileInfoDialog";
import PostsComponent from "../components/PostsComponent";
import FriendsComponent from "../components/FriendsComponent";
import FriendRequestsComponent from "../components/FriendRequestsComponent";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isEditPictureDialogOpen, setEditPictureDialogOpen] = useState(false);
  const [isEditInfoDialogOpen, setEditInfoDialogOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
  }, []);

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
  function TabPanel({ children, value, index, ...other }) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
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
          <Button
            variant="contained"
            color="secondary"
            sx={{ mx: 2 }}
            onClick={handleEditInfo}
          >
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

        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Posts" />
          <Tab label="Friends" />
          <Tab label="Friend Requests" />
        </Tabs>
        <TabPanel value={tabValue} index={0} style={{width: "100%"}}>
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
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1} style={{width: "100%"}}>
          <FriendsComponent
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarOpen={setSnackbarOpen}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2} style={{width: "100%"}}>
          <FriendRequestsComponent
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarOpen={setSnackbarOpen}/>
        </TabPanel>
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
