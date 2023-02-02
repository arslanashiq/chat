import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ open, setOpen, handleAgree, title }) {
  const handleClose = () => {
    setOpen(false);
  };
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setisLoading(false);
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title ? title : "Are you sure you want to procede?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            disabled={isLoading}
            onClick={() => {
              setisLoading(true);
              handleAgree();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
