import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import userService from "../services/UserService";
import { useFormik } from "formik";
import * as Yup from "yup";

const RegisterForm = () => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Minimum 3 characters").required("Required"),
      lastname: Yup.string()
        .min(3, "Minimum 3 characters")
        .required("Required"),
      email: Yup.string().email("Invalid email format").required("Required"),
      username: Yup.string()
        .min(3, "Minimum 3 characters")
        .required("Required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  const handleRegister = async (values) => {
    try {
      const data = await userService.register(values);
      setSnackbarMessage(data);
      setSnackbarOpen(true);
      formik.resetForm();
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "primary.white",
        borderRadius: "5px",
        width: "48%",
        px: 4,
        py: 10,
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        style={{ width: "80%", margin: "auto" }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign="center"
          color="primary.text"
          sx={{ fontWeight: 700, fontSize: 36, pt: 4 }}
        >
          Register
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            fullWidth
            required
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
            sx={{ width: "45%" }}
          />

          <TextField
            fullWidth
            required
            id="lastname"
            name="lastname"
            label="Last Name"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
            margin="normal"
            sx={{ width: "50%" }}
          />
        </Box>

        <TextField
          fullWidth
          required
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Register
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default RegisterForm;
