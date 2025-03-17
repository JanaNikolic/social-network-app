import { useState, useEffect, FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import postService from "../../services/PostService";

interface EditPostProps {
  open: boolean;
  handleClose: () => void;
  postId: number;
  postContent: string;
  handleSaveEdit: (newContent: string, message: string) => void;
}

const EditPost: FC<EditPostProps> = ({
  open,
  handleClose,
  handleSaveEdit,
  postContent,
  postId,
}) => {
  const [content, setContent] = useState<string>(postContent);

  useEffect(() => {
    setContent(postContent);
  }, [postContent]);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    try {
      await postService.editPost(content, postId);
      handleSaveEdit(content, "Post updated successfully!");
    } catch (err: any) {
      handleSaveEdit("", err.message);
    }
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
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          variant="outlined"
          margin="dense"
          id="content"
          name="content"
          label="Post Content"
          type="text"
          fullWidth
          multiline
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPost;
