// routes
import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import Routers from "./routes";
import { SnackbarProvider } from "notistack";
import { Slide } from "@mui/material";


// ----------------------------------------------------------------------

export default function App() {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      TransitionComponent={Slide}
      maxSnack={2}
    >
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </SnackbarProvider>
  );
}
