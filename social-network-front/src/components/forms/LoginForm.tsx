import { useState } from "react";
import { TextField, Button, Typography, Box, Snackbar } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import authService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginRequest } from "../../interfaces/login.interfaces";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: LoginRequest) => {
    try {
      await authService.login(values);
      navigate("/home");
    } catch (err: any) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography
        component="h1"
        variant="h4"
        color="primary.text"
        sx={{ fontWeight: 500, fontSize: 36, pt: 4 }}
      >
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "80%" }}>
        <Box sx={{ mt: 2, margin: "auto" }}>
          <TextField
            {...register("email")}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("password")}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default LoginForm;
