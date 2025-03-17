import { useEffect, useState } from "react";
import { Container, Typography, Box, Snackbar } from "@mui/material";
import userService from "../services/UserService";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import postService from "../services/PostService";
import CommentList from "../components/CommentList";
import { PostResponse } from "../interfaces/post.interfaces";

const PostPage = () => {
  const { postId } = useParams<string>();
  const { userId } = useParams<string>();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [reloadComments, setReloadComments] = useState(false);

  useEffect(() => {
    const fetchProfilePicture = async (postedBy: string) => {
      try {
        const data = await userService.fetchProfilePicture(postedBy);
        setProfilePicture(data);
      } catch (err: any) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };

    const fetchPost = async () => {
      if (!postId) return;
      try {
        const data = await postService.fetchPostById(Number(postId));
        if (data.postedBy.id == Number(userId)) {
          setPost(data);
        } else {
          setMessage(
            "Hmm...this page doesn’t exist. Try searching for something else."
          );
        }
      } catch (err: any) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    };
    fetchPost();
    if (!userId) return;
    fetchProfilePicture(userId?.toString());
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
            setReloadComments={setReloadComments} onCommentCountChange={(count: number) => {
              console.log(count);
            } }          />
          <CommentList
            postId={Number(postId)}
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
