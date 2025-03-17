import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import friendService from "../services/FriendService";
import UserInfoCard from "./UserInfoCard";
import { Friend } from "../interfaces/friends.interfaces";

interface FriendsComponentProps {
  setSnackbarMessage: (message: string) => void;
  setSnackbarOpen: (open: boolean) => void;
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({ setSnackbarMessage, setSnackbarOpen }) => {
  const [page, setPage] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchFriends = async (page: number) => {
    try {
      const data = await friendService.getFriends(page, 10);
      if (data.friends.length > 0) {
        setFriends((prevFriends) => [...prevFriends, ...data.friends]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
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
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {friends.length > 0 ? (
        friends.map((friend: Friend) => <UserInfoCard key={friend.id} user={friend} />)
      ) : (
        <Typography>No friends to display.</Typography>
      )}
      <div id="scroll-anchor" style={{ height: "20px" }} />
    </Box>
  );
};
export default FriendsComponent;
