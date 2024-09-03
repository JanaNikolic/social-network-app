import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import friendService from "../services/FriendService";
import UserInfoCard from "./UserInfoCard";

const FriendsComponent = ({ setSnackbarMessage, setSnackbarOpen }) => {
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [friends, setFriends] = useState([]);

  const fetchFriends = async (page) => {
    try {
      const data = await friendService.getFriends(page, 10);
      if (data.friends.length > 0) {
        setFriends((prevFriends) => [...prevFriends, ...data.friends]);
        setPage((prevPage) => prevPage + 1);
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

  useEffect(() => {
    if (!loadingMore && hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setLoadingMore(true);
            fetchFriends(page);
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
  }, [page, loadingMore, hasMore, setSnackbarMessage, setSnackbarOpen]);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {friends.length > 0 ? (
        friends.map((friend) => (
          <UserInfoCard key={friend.id} user={friend} />
        ))
      ) : (
        <Typography>No friends to display.</Typography>
      )}
      <div id="scroll-anchor" style={{ height: "20px" }} />
    </Box>
  );
  
};
export default FriendsComponent;
