import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Snackbar } from "@mui/material";
import userService from "../services/UserService";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import postService from "../services/PostService";
import CommentList from "../components/CommentList";

const PostPage = () => {
  const { postId } = useParams();
  const { userId } = useParams();
  const [post, setPost] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [reloadComments, setReloadComments] = useState(false);

  useEffect(() => {
    const fetchProfilePicture = async (postedBy) => {
      try {
        const data = await userService.fetchProfilePicture(postedBy);
        setProfilePicture(data);
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };

    const fetchPost = async () => {
      try {
        const data = await postService.fetchPostById(postId);
        if (data.postedBy.id == userId) {
          setPost(data);
        } else {
          setMessage(
            "Hmm...this page doesn’t exist. Try searching for something else."
          );
        }
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };
    fetchPost();
    fetchProfilePicture(userId);
  }, [postId, userId]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "primary.white", pt: 10 }}>
      {post ? (
        <Box>
          <Post
            key={post.id}
            id={post.id}
            userId={post.postedBy.id}
            username={post.postedBy.username}
            name={post.postedBy.name}
            lastname={post.postedBy.lastname}
            content={post.content}
            isLiked={post.isLiked}
            numOfLikes={post.numOfLikes}
            numOfComments={post.numOfComments}
            createdAt={post.createdAt}
            profilePicture={profilePicture}
            setReloadComments={setReloadComments}
          />
          <CommentList
            postId={postId}
            reloadComments={reloadComments}
            setReloadComments={setReloadComments}
          />
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
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default PostPage;
