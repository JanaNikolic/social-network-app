import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import postService from "../../services/PostService";
import { PostRequest, PostResponse } from "../../interfaces/post.interfaces";

interface PostFormProps {
  open: boolean;
  handleClose: () => void;
  handlePostSubmit: (post: PostRequest | null, message: string) => void;
}

const PostForm: FC<PostFormProps> = ({ open, handleClose, handlePostSubmit }) => {
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    try {
      const newPost = await postService.addPost(content);
      const post: PostResponse = {
        id: newPost.id,
        postedBy: {
          id: newPost.postedBy,
          name: "",
          lastname: "",
          username: "",
          isFriend: false
        },
        createdAt: newPost.createdAt,
        content: newPost.content,
        isLiked: false,
        numOfLikes: 0,
        numOfComments: 0,
      };
      handlePostSubmit(post, "Successfuly created new post");
    } catch (err: any) {
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
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostForm;
