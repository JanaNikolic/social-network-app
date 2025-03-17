import { Container, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/forms/RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  const redirectToLogin = async () => {
    navigate("/login");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 10,
        display: "flex",
        justifyContent: "space-between",
        height: 1,
        width: 1,
      }}
    >
      <RegisterForm></RegisterForm>

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
          right: "5px",
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
          Have an account?
        </Typography>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          color="primary"
          onClick={redirectToLogin}
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
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
