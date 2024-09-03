import React, { useEffect, useState, useRef } from "react";
import { Typography, Box } from "@mui/material";
import friendService from "../services/FriendService";
import FriendRequestCard from "./FriendRequestCard";

const FriendRequestsComponent = ({ setSnackbarMessage, setSnackbarOpen }) => {
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [requests, setRequests] = useState([]);
  const observerRef = useRef(null);

  const handleRemoveRequest = (userId, accepted) => {
    setRequests((prevRequests) =>
      prevRequests.filter((friend) => friend.id !== userId)
    );
    if (accepted) setSnackbarMessage("Friend request accepted");
    else setSnackbarMessage("Friend request deleted");

    setSnackbarOpen(true);
  };

  const fetchRequests = async (page) => {
    try {
      const data = await friendService.getFriendRequests(page, 10);
      if (data.friends.length > 0) {
        setRequests((prevRequests) => [...prevRequests, ...data.friends]);
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
      const target = document.querySelector("#scroll-anchor");

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setLoadingMore(true);
            fetchRequests(page);
          }
        },
        { threshold: 1.0 }
      );

      if (target) observerRef.current.observe(target);

      return () => {
        if (observerRef.current) observerRef.current.disconnect();
      };
    }
  }, [loadingMore, hasMore, page, setSnackbarMessage, setSnackbarOpen]);

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
      {requests.length > 0 ? (
        requests.map((friend) => (
          <FriendRequestCard
            key={friend.id}
            user={friend}
            onRemoveRequest={handleRemoveRequest}
          />
        ))
      ) : (
        <Typography>No requests to display.</Typography>
      )}
      <div id="scroll-anchor" style={{ height: "20px" }} />
    </Box>
  );
};

export default FriendRequestsComponent;
