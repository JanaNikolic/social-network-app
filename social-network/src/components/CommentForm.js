import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

const CommentForm = ({
  open,
  handleClose,
  postId,
  setSnackbarMessage,
  setSnackbarOpen,
  initialContent = "",
  onSubmit,
  isEditing = false,
}) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(content, postId);
      setSnackbarMessage(isEditing ? "Successfully updated comment" : "Successfully posted comment");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
    setContent("");
    handleClose();
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{isEditing ? "Edit your comment" : "Post your comment"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          variant="outlined"
          margin="dense"
          id="content"
          name="content"
          label="Comment Content"
          type="text"
          fullWidth
          multiline
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? "Update" : "Comment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentForm;
