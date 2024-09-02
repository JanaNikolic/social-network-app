import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Card,
  Snackbar,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import userService from "../services/UserService";
import moment from "moment";
import postService from "../services/PostService";
import jwtUtils from "../utils/jwtUtils";
import EditPost from "./EditPost";

const Post = ({
  id,
  userId,
  username,
  content,
  isLiked,
  numOfLikes,
  numOfComments,
  createdAt,
  profilePicture,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const currentUserId = Number(jwtUtils.getIdFromToken());
  const [profilePic, setProfilePicture] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditPostOpen = () => {
    setCurrentContent(content);
    setIsEditPostOpen(true);
  };

  const handleEditPostClose = () => {
    setIsEditPostOpen(false);
  };

  const handleSaveEdit = (newContent, message) => {
    if (newContent) setCurrentContent(newContent);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
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
    if (!profilePicture) fetchProfilePicture();
    else setProfilePicture(profilePicture);
  }, [userId, profilePicture]);

  const formatCreatedAt = (date) => {
    const now = moment();
    const created = moment(date);

    if (now.diff(created, "minutes") < 60) {
      return `${now.diff(created, "minutes")} minutes ago`;
    } else if (now.diff(created, "hours") < 24) {
      return `${now.diff(created, "hours")} hours ago`;
    } else if (now.diff(created, "days") < 7) {
      return `${now.diff(created, "days")} days ago`;
    } else {
      return created.format("D MMMM YYYY");
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.dislikePost(id);
        isLiked = false;
      } else {
        await postService.likePost(id);
        isLiked = true;
      }
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Card
      sx={{ padding: 2, border: "1px solid #ddd", borderRadius: "8px", mb: 2 }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar
            src={profilePic}
            alt={username}
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Typography variant="h6">{username}</Typography>
        </Box>
        {currentUserId === userId && (
          <IconButton onClick={handleEditPostOpen}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
        {currentContent}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <IconButton
            color={isLiked ? "primary" : "default"}
            onClick={handleLike}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {numOfLikes}
          </Typography>
          <CommentIcon />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {numOfComments}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {formatCreatedAt(createdAt)}
        </Typography>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      <EditPost
        open={isEditPostOpen}
        handleClose={handleEditPostClose}
        handleSaveEdit={handleSaveEdit}
        postContent={currentContent}
        postId={id}
      />
    </Card>
  );
};

export default Post;
