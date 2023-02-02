import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { register } from "../../DAL/auth";
import { useSnackbar } from "notistack";

const theme = createTheme();
export default function SignUp() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [full_name, setFull_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = {
        full_name,
        email,
        password,
        contact_number: "121212121",
      };
      const resp = await register(postData);
      if (resp.code == 200) {
        navigate("/login");
      } else {
        enqueueSnackbar(resp.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };
  useEffect(() => {
    setFull_name("");
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
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  value={full_name}
                  onChange={(e) => {
                    setFull_name(e.target.value);
                  }}
                  name="fullname"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
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
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/login");
                  }}
                  variant="body2"
                >
                  Already have an account? Login
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
