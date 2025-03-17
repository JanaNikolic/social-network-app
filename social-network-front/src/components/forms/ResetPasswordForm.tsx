import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Snackbar } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import userService from "../../services/UserService";
import { ResetPasswordFormValues } from "../../interfaces/password.interfaces";

const ResetPasswordForm = () => {
  const { uuid } = useParams<string>();
  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required"),
      newPassword: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      if (!uuid) {
        setSnackbarMessage("Invalid reset link.");
        setSnackbarOpen(true);
        return;
      }
      
      try {
        await userService.resetPassword({
          id: uuid,
          email: values.email,
          newPassword: values.newPassword,
        });
        navigate("/login");
      } catch (err: any) {
        setSnackbarMessage(err.message);
        setSnackbarOpen(true);
      }
    },
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <form
        onSubmit={formik.handleSubmit}
        style={{ width: "70%", margin: "auto" }}
      >
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
          id="newPassword"
          name="newPassword"
          label="New Password"
          type="password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Reset Password
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

export default ResetPasswordForm;
