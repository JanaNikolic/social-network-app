import { Typography, Box } from "@mui/material";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.white",
        borderRadius: "5px",
        width: "30%",
        px: 4,
        py: 10,
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        margin: "auto",
        mt: 10,
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
        Reset Password
      </Typography>
      <ResetPasswordForm />
    </Box>
  );
};

export default ResetPasswordPage;
