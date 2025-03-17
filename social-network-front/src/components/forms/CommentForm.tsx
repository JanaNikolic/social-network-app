import { useState, useEffect, Dispatch, SetStateAction, FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface CommentFormProps {
  open: boolean;
  handleClose: () => void;
  postId: number;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  initialContent: string | undefined;
  onSubmit: (content: string, postId: number) => void;
  isEditing: boolean;
}

const CommentForm: FC<CommentFormProps> = ({
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

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    try {
      onSubmit(content, postId);
      setSnackbarMessage(isEditing ? "Successfully updated comment" : "Successfully posted comment");
      setSnackbarOpen(true);
    } catch (err: any) {
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
