import { useEffect, useCallback, SetStateAction, Dispatch, FC } from "react";
import { Typography, Box } from "@mui/material";
import Post from "../components/Post";
import postService from "../services/PostService";
import jwtUtils from "../utils/jwtUtils";
import { PostRequest } from "../interfaces/post.interfaces";

interface PostsComponentProps {
  profilePicture: string | null;
  posts: PostRequest[];
  setPosts: Dispatch<SetStateAction<PostRequest[]>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  loadingMore: boolean;
  setLoadingMore: Dispatch<SetStateAction<boolean>>;
  hasMore: boolean;
  setHasMore: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  profileUserId?: number;
  isFriend: boolean;
  reloadPosts: boolean;
  setReloadPosts: Dispatch<SetStateAction<boolean>>;
}

const PostsComponent: FC<PostsComponentProps> = ({
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
  const fetchPosts = useCallback(async () => {
    try {
      let data;

      if (profileUserId && isFriend) {
        data = await postService.fetchPostsForUser(profileUserId, page, 10);
      } else if (!profileUserId) {
        const userId = jwtUtils.getIdFromToken();
        data = await postService.fetchPostsForUser(userId, page, 10);
      }

      if (data && data.posts.length > 0) {
        setPosts((prevPosts) => {
          const newPosts = [...prevPosts, ...data.posts];
          const uniquePosts = Array.from(new Set(newPosts.map((post) => post.id)))
            .map((id) => newPosts.find((post) => post.id === id)!);
          return uniquePosts;
        });

        setPage((prevPage) => prevPage + 1);
        setHasMore(data.posts.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "An error occurred");
      setSnackbarOpen(true);
    } finally {
      if (reloadPosts) {
        setReloadPosts(false);
      }
      setLoadingMore(false);
    }
  }, [profileUserId, isFriend, page, setPosts, setPage, setHasMore, setSnackbarMessage, setSnackbarOpen, setLoadingMore, reloadPosts, setReloadPosts]);

  useEffect(() => {
    if (reloadPosts) {
      setPosts([]);
      setPage(0);
      setHasMore(true);
      fetchPosts();
      return;
    }

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
      observer.disconnect();
    };
  }, [reloadPosts, fetchPosts, hasMore, loadingMore]);

  return (
    <Box sx={{ width: "100%" }}>
      {profileUserId && !isFriend && <Typography>Not yet friends</Typography>}

      {posts.length > 0 ? (
        posts.map((post) => (
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
            profilePicture={profilePicture ?? ""}
            setReloadComments={() => { }}
            onCommentCountChange={(count: number) => {
              console.log(`New comment count: ${count}`);
            }}
          />

        ))
      ) : (
        isFriend && <Typography>No posts to display.</Typography>
      )}

      <div id="scroll-anchor" style={{ height: "20px" }} />
    </Box>
  );
};

export default PostsComponent;
