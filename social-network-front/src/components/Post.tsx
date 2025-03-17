import { useState, useEffect, Dispatch, FC, SetStateAction } from "react";
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Card,
  Snackbar,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import userService from "../services/UserService";
import moment from "moment";
import postService from "../services/PostService";
import jwtUtils from "../utils/jwtUtils";
import EditPost from "./dialogs/EditPost";
import CommentForm from "./forms/CommentForm";
import { useNavigate } from "react-router-dom";

interface PostProps {
  id: number;
  userId: number;
  username: string;
  name: string;
  lastname: string;
  content: string;
  isLiked: boolean;
  numOfLikes: number;
  numOfComments: number;
  createdAt: string;
  profilePicture?: string;
  setReloadComments: Dispatch<SetStateAction<boolean>>;
  onCommentCountChange: (count: number) => void;
}

const Post: FC<PostProps> = ({
  id,
  userId,
  username,
  name,
  lastname,
  content,
  isLiked: initialIsLiked,
  numOfLikes: initialNumOfLikes,
  numOfComments: initialNumOfComments,
  createdAt,
  profilePicture,
  setReloadComments,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isEditPostOpen, setIsEditPostOpen] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<string>(content);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [numOfLikes, setNumOfLikes] = useState<number>(initialNumOfLikes);
  const [numOfComments, setNumOfComments] = useState<number>(initialNumOfComments);
  const [profilePic, setProfilePic] = useState<string | undefined>(profilePicture);
  const [isAddCommentOpen, setIsAddCommentOpen] = useState<boolean>(false);
  // const [commentId, setCommentId] = useState<number | null>(null); TODO
  const currentUserId = Number(jwtUtils.getIdFromToken());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!profilePicture) {
        try {
          const data = await userService.fetchProfilePicture(userId.toString());
          setProfilePic(data);
        } catch (err) {
          setSnackbarMessage(err instanceof Error ? err.message : "Error fetching profile picture");
          setSnackbarOpen(true);
        }
      }
    };

    fetchProfilePicture();
  }, [userId, profilePicture]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleEditPostOpen = () => {
    setCurrentContent(content);
    setIsEditPostOpen(true);
  };

  const handleEditPostClose = () => setIsEditPostOpen(false);
  const handleAddCommentClose = () => setIsAddCommentOpen(false);

  const handleSaveEdit = (newContent: string, message: string) => {
    if (newContent) setCurrentContent(newContent);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const formatCreatedAt = (date: string): string => {
    const created = moment(date);
    const now = moment();

    if (now.diff(created, "minutes") < 60) {
      return `${now.diff(created, "minutes")} minutes ago`;
    } else if (now.diff(created, "hours") < 24) {
      return `${now.diff(created, "hours")} hours ago`;
    } else if (now.diff(created, "days") < 7) {
      return `${now.diff(created, "days")} days ago`;
    }
    return created.format("D MMMM YYYY");
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.dislikePost(id);
        setIsLiked(false);
        setNumOfLikes((prev) => prev - 1);
      } else {
        await postService.likePost(id);
        setIsLiked(true);
        setNumOfLikes((prev) => prev + 1);
      }
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error processing like action");
      setSnackbarOpen(true);
    }
  };

  const handleCreateCommentOpen = () => setIsAddCommentOpen(true);

  const handleAddComment = async (content: string, postId: number) => {
    try {
      await postService.postComment(content, postId);
      setSnackbarMessage("Successfully posted comment");
      setSnackbarOpen(true);
      setReloadComments(true);
      setNumOfComments((prev) => prev + 1);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error posting comment");
      setSnackbarOpen(true);
    }
  };

  const handlePostClick = () => navigate(`/${username}/${userId}/post/${id}`);

  return (
    <Card sx={{ padding: 2, border: "1px solid #ddd", borderRadius: "8px", mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar src={profilePic} alt={username} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="body1" fontWeight="bold">
            {name} {lastname}{" "}
            <Typography component="span" variant="subtitle2" color="textSecondary">
              @{username}
            </Typography>
          </Typography>
        </Box>
        {currentUserId === userId && (
          <IconButton onClick={handleEditPostOpen}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Typography variant="body1" sx={{ mt: 2, mb: 2, cursor: "pointer" }} onClick={handlePostClick}>
        {currentContent}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <IconButton color={isLiked ? "primary" : "default"} onClick={handleLike}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {numOfLikes}
          </Typography>
          <IconButton onClick={handleCreateCommentOpen}>
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {numOfComments}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {formatCreatedAt(createdAt)}
        </Typography>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
      <EditPost open={isEditPostOpen} handleClose={handleEditPostClose} handleSaveEdit={handleSaveEdit} postContent={currentContent} postId={id} />
      <CommentForm open={isAddCommentOpen} handleClose={handleAddCommentClose} postId={id} onSubmit={handleAddComment} isEditing={false} setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen} initialContent={undefined} />
    </Card>
  );
};

export default Post;
