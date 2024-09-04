import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import LoggedInUserGuard from "./utils/LoggedInUserGuard";
import UserProfilePage from "./pages/UserProfilePage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import ProtectedLayout from "./components/ProtectedLayout";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7ea8be",
      white: "#f6f0ed",
      contrastText: "#ffffff",
      dark: "#28536b",
    },
    text: {
      primary: "#000000",
    },
    secondary: {
      main: "#c2948a",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          textTransform: "none",
          fontWeight: "bold",
          fontSize: 16,
          color: "#000000",
          "&:hover": {
            backgroundColor: "primary.dark",
            color: "#ffffff",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<LoggedInUserGuard />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password/reset" element={<LoginPage />} />
          </Route>
          <Route path="/reset-password/:uuid" element={<ResetPasswordPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/account/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<UserProfilePage />} />
              <Route
                path="/:username/:userId/post/:postId"
                element={<PostPage />}
              />
              <Route path="/home" element={<HomePage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
