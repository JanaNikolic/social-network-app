import React, { useState, useEffect } from "react";
import { Avatar, Box, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import userService from "../services/UserService";

const UserInfoCard = ({ user }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const data = await userService.fetchProfilePicture(user.id);
        setProfilePicture(data);
      } catch (err) {}
    };
    fetchProfilePicture();
  }, [user.id]);

  const handleCardClick = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <Card
      sx={{
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        mb: 2,
        width: "25%",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <Box display="flex" alignItems="center" justifyContent="left">
        <Avatar
          src={profilePicture}
          alt={user.username}
          sx={{ width: 50, height: 50, mr: 2 }}
        />
        <Box display="flex" alignItems="left" flexDirection="column">
          <Typography variant="body1">
            {`${user.name} ${user.lastname}`}
          </Typography>
          <Typography variant="body2">@{user.username}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default UserInfoCard;
