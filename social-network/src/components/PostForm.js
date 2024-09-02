import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import postService from "../services/PostService";

const PostForm = ({ open, handleClose, handlePostSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newPost = await postService.addPost(content);
      const post = {
        id: newPost.id,
        postedBy: null,
        createdAt: newPost.createdAt,
        content: newPost.content,
        isLiked: false,
        numOfLikes: 0,
        numOfComments: 0,
      };
      handlePostSubmit(post, "Successfuly created new post");
    } catch (err) {
      handlePostSubmit(null, err.message);
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
      <DialogTitle>Create Post</DialogTitle>
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
          row={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="secondary">Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Post</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostForm;
