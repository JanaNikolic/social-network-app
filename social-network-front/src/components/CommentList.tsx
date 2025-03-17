import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import jwtUtils from "../utils/jwtUtils";
import moment from "moment";
import postService from "../services/PostService";
import userService from "../services/UserService";
import CommentForm from "./forms/CommentForm";
import { Comment, CommentWithPhoto } from "../interfaces/comment.interfaces";

interface CommentListProps {
  postId: number,
  reloadComments: boolean,
  setReloadComments: (reload: boolean) => void,
}

const CommentList: React.FC<CommentListProps> = ({ postId, reloadComments, setReloadComments }) => {
  const [comments, setComments] = useState<CommentWithPhoto[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isEditingCommentOpen, setIsEditingCommentOpen] = useState<boolean>(false);
  const [commentBeingEdited, setCommentBeingEdited] = useState<Comment | null>(null);
  const loggedInUserId = jwtUtils.getIdFromToken();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchProfilePhoto = async (userId: number) => {
    try {
      const data = await userService.fetchProfilePicture(userId.toString());
      return data;
    } catch (err: any) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
      return null;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await postService.fetchPostsComments(postId, page, 10);
        const commentsWithPhotos: CommentWithPhoto[] = await Promise.all(
          data.comments.map(async (comment: Comment) => {
            const profilePhoto = (await fetchProfilePhoto(comment.commentedBy.id)) ?? "";
            return { ...comment, profilePhoto };
          })
        );


        if (reloadComments) {
          setComments(commentsWithPhotos);
          setPage(1);
          setHasMore(true);
          setReloadComments(false);
        } else {
          setComments((prev) => [...prev, ...commentsWithPhotos]);
          setHasMore(data.comments.length > 0);
          setPage((prev) => prev + 1);
        }
      } catch (err: any) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (reloadComments) {
      setComments([]);
      setPage(0);
      setHasMore(false);
      fetchComments();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            setLoading(true);
            fetchComments();
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
  }, [page, loading, hasMore, reloadComments, setReloadComments]);

  const handleEdit = (comment: Comment) => {
    setCommentBeingEdited(comment);
    setIsEditingCommentOpen(true);
  };

  const handleEditComment = async (content: string) => {
    if (!commentBeingEdited) return;

    const commentId = commentBeingEdited.id;
    try {
      await postService.editComment(content, postId, commentId);
      setSnackbarMessage("Successfully updated comment");
      setSnackbarOpen(true);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, content } : comment
        )
      );
    } catch (err: any) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
    setIsEditingCommentOpen(false);
    setCommentBeingEdited(null);
  };

  const handleEditCommentClose = () => {
    setIsEditingCommentOpen(false);
    setCommentBeingEdited(null);
  };

  const formatCreatedAt = (date: string) => {
    const now = moment();
    const created = moment(date);

    if (now.diff(created, "minutes") < 60) {
      return `${now.diff(created, "minutes")} minutes ago`;
    } else if (now.diff(created, "hours") < 24) {
      return `${now.diff(created, "hours")} hours ago`;
    } else if (now.diff(created, "days") < 7) {
      return `${now.diff(created, "days")} days ago`;
    } else {
      return created.format("D MMMM YYYY");
    }
  };

  return (
    <>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                src={comment.profilePhoto}
                alt={comment.commentedBy.username}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  variant="body1"
                  color="textPrimary"
                  fontWeight="bold"
                >
                  {comment.commentedBy.name} {comment.commentedBy.lastname}{" "}
                  <Typography
                    component="span"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    @{comment.commentedBy.username}
                    {" — "}
                    {formatCreatedAt(comment.createdAt)}
                  </Typography>
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="subtitle1" color="textPrimary">
                    {comment.content}
                  </Typography>
                </>
              }
            />
            {comment.commentedBy.id == loggedInUserId && (
              <Box>
                <IconButton onClick={() => handleEdit(comment)}>
                  <Edit />
                </IconButton>
              </Box>
            )}
          </ListItem>
        ))}
        <div id="scroll-anchor" style={{ height: "20px" }} />
      </List>
      {comments.length === 0 && (
        <Typography>No comments to display.</Typography>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      {commentBeingEdited && (
        <CommentForm
          open={isEditingCommentOpen}
          handleClose={handleEditCommentClose}
          postId={postId}
          initialContent={commentBeingEdited.content}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarOpen={setSnackbarOpen}
          onSubmit={handleEditComment}
          isEditing={true}
        />
      )}
    </>
  );
};

export default CommentList;
