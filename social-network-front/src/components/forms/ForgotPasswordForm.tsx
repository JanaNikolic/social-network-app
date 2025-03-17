import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Link,
  Snackbar,
} from "@mui/material";
import { useFormik } from "formik";
import userService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ForgotPasswordRequest } from "../../interfaces/password.interfaces";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const formik = useFormik<ForgotPasswordRequest>({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required"),
    }),
    onSubmit: async (values: ForgotPasswordRequest) => {
      await handleResetPassword(values);
    },
  });

  const handleResetPassword = async (values: ForgotPasswordRequest) => {
    try {
      const data = await userService.forgotPassword(values);
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
      formik.resetForm();
    } catch (err: any) {
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: 1,
      }}
    >
      <form onSubmit={formik.handleSubmit} style={{ width: "80%" }}>
        <Typography variant="h5" gutterBottom>
          Trouble logging in?
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
          Enter your email and we'll send you a link to get back into your
          account.
        </Typography>
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
          sx={{ mb: 4 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Reset Link
        </Button>
      </form>
      <Divider sx={{ width: "100%", my: 3 }} />
      <Link
        component="button"
        variant="body2"
        onClick={() => navigate("/login")}
      >
        Back to login
      </Link>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ForgotPasswordForm;
