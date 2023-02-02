import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { login } from "../../DAL/auth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const theme = createTheme();

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const _set_token = (token) => {
    localStorage.setItem("token", token);
  };
  const _set_user = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = {
        email,
        password,
        type: 1,
      };

      let resp = await login(postData);
      if (resp.code == 200) {
        _set_token(resp.token);
        _set_user(resp.user);
        navigate("/chat");
      } else {
        enqueueSnackbar(resp.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });

    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography> */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => setShowPassword(!showPassword)}
                  value={showPassword}
                  color="primary"
                />
              }
              label="Show Password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/register");
              }}
              variant="body2"
            >
              Do not have an account? Register
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
