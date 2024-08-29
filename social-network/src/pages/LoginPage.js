import React from "react";
import { Container, Box, Button, Typography, Link } from "@mui/material";
import LoginForm from "../components/LoginForm";
import { useNavigate, useLocation } from "react-router-dom";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleForgotPassword = () => {
    navigate("/password/reset");
  };

  const redirectToRegister = async () => {
    navigate("/register");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 20,
        display: "flex",
        justifyContent: "space-between",
        height: 1,
        width: 1,
        minHeight: "58vh",
      }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(-90deg, rgb(235, 177, 163) 28%, rgb(235, 177, 163) 63%, rgb(235, 177, 163) 92.5%)",
          backdropFilter: "blur(10px)",
          borderRadius: "5px",
          width: "48%",
          px: 4,
          alignContent: "center",
          textAlign: "center",
          position: "relative",
          right: "-5px",
          zIndex: 1,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign="center"
          color="primary.text"
          sx={{ fontWeight: 700, fontSize: 36, pt: 4 }}
        >
          Welcome
        </Typography>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          textAlign="center"
          color="primary.text"
          sx={{ fontWeight: 500, fontSize: 16 }}
        >
          Don't have an account?
        </Typography>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          color="primary"
          onClick={redirectToRegister}
          sx={{
            mt: 4,
            width: "30%",
            backgroundColor: "transparent",
            borderColor: "primary.dark",
            "&:hover": {
              backgroundColor: "primary.main",
              borderColor: "primary.main",
              color: "text.primary",
            },
          }}
        >
          Register
        </Button>
      </Box>
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "primary.white",
          borderRadius: "5px",
          width: "48%",
          px: 4,
          py: 10,
          position: "relative",
          zIndex: 2,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        {location.pathname === "/password/reset" ? (
          <ForgotPasswordForm />
        ) : (
          <>
            <LoginForm />
            <Link
              variant="body2"
              component="button"
              gutterBottom
              alignSelf="end"
              color="gray"
              underline="none"
              onClick={handleForgotPassword}
              sx={{
                fontWeight: 200,
                margin: "auto",
                fontSize: 16,
                my: 4,
                width: "80%",
                textAlign: "end",
              }}
            >
              Forgot Password?
            </Link>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
