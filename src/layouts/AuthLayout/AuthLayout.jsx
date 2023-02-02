import { Link as RouterLink, Outlet, Navigate } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import Logo from "./component/Logo";
import { Box } from "@mui/material";

// components

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
function AuthLayout() {
    if (localStorage.getItem("token")) {
      return <Navigate to="/chat"> </Navigate>;
    }
  return (
    <>
      <Box sx={{ padding: 1,backgroundColor:'skyblue' }}>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </Box>
      <Outlet />
    </>
  );
}

export default AuthLayout;
