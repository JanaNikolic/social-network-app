import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import userService from "../services/UserService";

const EditProfilePictureDialog = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("picture", selectedFile);

    try {
      await userService.editProfilePicture(formData);
      onClose(selectedFile, "Profile picture updated successfully!");
    } catch (error) {
      onClose(null, error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Profile Picture</DialogTitle>
      <DialogContent>
        <TextField
          type="file"
          onChange={handleFileChange}
          fullWidth
          inputProps={{ accept: "image/png, image/jpeg" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfilePictureDialog;
