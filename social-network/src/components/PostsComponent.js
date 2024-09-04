import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import Post from "../components/Post";
import postService from "../services/PostService";
import jwtUtils from "../utils/jwtUtils";

const PostsComponent = ({
  profilePicture,
  posts,
  setPosts,
  page,
  setPage,
  loadingMore,
  setLoadingMore,
  hasMore,
  setHasMore,
  setSnackbarMessage,
  setSnackbarOpen,
  profileUserId,
  isFriend,
  reloadPosts,
  setReloadPosts,
}) => {
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let data;
        if (profileUserId && isFriend) {
          data = await postService.fetchPostsForUser(profileUserId, page, 10);
        } else if (!profileUserId && !isFriend) {
          const userId = jwtUtils.getIdFromToken();
          data = await postService.fetchPostsForUser(userId, page, 10);
        }

        if (data && data.posts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
        setLoadingMore(false);
      } finally {
        if (reloadPosts) {
          setReloadPosts(false);
        }
        setLoadingMore(false);
      }
    };

    if (reloadPosts) {
      setPosts([]);
      setPage(0);
      setHasMore(false);
      fetchPosts();
    } else {
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
    }
  }, [
    page,
    loadingMore,
    hasMore,
    profileUserId,
    setPosts,
    setSnackbarMessage,
    setSnackbarOpen,
    reloadPosts,
    setReloadPosts
  ]);

  return (
    <Box>
      {profileUserId && !isFriend && <Typography>Not yet friends</Typography>}
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
              profilePicture={profilePicture}
            />
          ))
        : posts.length === 0 &&
          isFriend && <Typography>No posts to display.</Typography>}
      <div id="scroll-anchor" style={{ height: "20px" }} />
    </Box>
  );
};

export default PostsComponent;
