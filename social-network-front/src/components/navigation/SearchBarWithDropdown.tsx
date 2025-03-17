import { useState, useEffect, useRef, ChangeEvent } from "react";
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
import userService from "../../services/UserService";
import { UserWithPicture, UserList } from "../../interfaces/user.interfaces";

const SearchBarWithDropdown = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<UserWithPicture[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const fetchUserLists = async (searchQuery: string) => {
    try {
      const users: UserList = await userService.searchUsers(searchQuery, 0, 100);

      const usersWithPictures: UserWithPicture[] = await Promise.all(
        users.users.map(async (user): Promise<UserWithPicture> => {
          try {
            const profilePictureResponse = await userService.fetchProfilePicture(user.id);
            return {
              ...user,
              profilePicture: profilePictureResponse,
            };
          } catch (error) {
            console.error(`Error fetching profile picture for user ${user.id}:`, error);
            return {
              ...user,
              profilePicture: "",
            };
          }
        })
      );

      setResults(usersWithPictures);
    } catch (err: any) {
      console.error("Error fetching search results:", err.message);
    }
  };


  const handleSearchChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.trim();
    setQuery(searchQuery);
    if (searchQuery) {
      fetchUserLists(searchQuery);
    } else {
      setResults([]);
    }
  }, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleUserSelected = (user: UserWithPicture) => {
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
