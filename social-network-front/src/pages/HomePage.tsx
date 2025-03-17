import { useEffect, useState } from "react";
import { Typography, Container, TextField, InputAdornment, IconButton, Snackbar } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import postService from "../services/PostService";
import { PostResponse, PostsResponse } from "../interfaces/post.interfaces";
import Post from "../components/Post";

const HomePage = () => {
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [content, setContent] = useState<string>("");

  const [page, setPage] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setSnackbarMessage("Post content cannot be empty.");
      setSnackbarOpen(true);
      return;
    }

    try {
      await postService.addPost(trimmedContent);
      setSnackbarMessage("Successfully created new post");
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
    setContent("");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data: PostsResponse = await postService.fetchFriendsPosts(page, 10);

        if (data && data.posts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } catch (err: any) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
        setLoadingMore(false);
      } finally {
        setLoadingMore(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          fetchPosts();
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

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "primary.white", mt: 8 }}>
      <TextField
        autoFocus
        variant="outlined"
        margin="dense"
        id="content"
        name="content"
        label="Post content"
        type="text"
        fullWidth
        multiline
        rows={2}
        value={content}
        sx={{ mb: 4 }}
        onChange={(e) => setContent(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSubmit}
                color="primary"
                disabled={!content.trim()}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {posts.length > 0
        ? posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            userId={post.postedBy.id}
            name={post.postedBy.name}
            lastname={post.postedBy.lastname}
            username={post.postedBy.username}
            content={post.content}
            isLiked={post.isLiked}
            numOfLikes={post.numOfLikes}
            numOfComments={post.numOfComments}
            createdAt={post.createdAt}
            profilePicture={""}
            setReloadComments={() => {}}
            onCommentCountChange={() => {}}
          />
        ))
        : posts.length === 0 && <Typography>No posts to display.</Typography>}
      <div id="scroll-anchor" style={{ height: "20px" }} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default HomePage;
