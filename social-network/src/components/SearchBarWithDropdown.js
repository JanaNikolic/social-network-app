import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
} from "@mui/material";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import userService from "../services/UserService";

const SearchBarWithDropdown = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchSearchResults = async (searchQuery) => {
    try {
      setLoading(true);
      const users = await userService.searchUsers(searchQuery, 0, 100);

      const usersWithPictures = await Promise.all(
        users.users.map(async (user) => {
          const profilePictureResponse = await userService.fetchProfilePicture(
            user.id
          );
          return {
            ...user,
            profilePicture: profilePictureResponse,
          };
        })
      );

      setResults(usersWithPictures);
    } catch (err) {
      console.error("Error fetching search results:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = debounce((event) => {
    const searchQuery = event.target.value.trim();
    setQuery(searchQuery);
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setResults([]);
    }
  }, 300);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleUserSelected = (user) => {
    navigate(`/profile/${user.id}`, { replace: true });
    window.location.reload();
  };
  

  return (
    <div style={{ position: "relative", height: "90%" }}>
      <TextField
        variant="outlined"
        placeholder="Search users..."
        onChange={handleSearchChange}
        sx={{
          backgroundColor: "primary.white",
          borderRadius: 1,
          width: "300px",
        }}
      />
      {query && results.length > 0 && (
        <Paper
          ref={dropdownRef}
          style={{
            position: "absolute",
            width: "300px",
            zIndex: 2,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <List>
            {results.map((user) => (
              <ListItem
                key={user.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                }}
                onClick={() => handleUserSelected(user)}
              >
                <ListItemAvatar>
                  <Avatar src={user.profilePicture} alt={user.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.name} ${user.lastname}`}
                  secondary={user.username}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default SearchBarWithDropdown;
