import React from 'react';
import { useState, useEffect } from "react";
import '../App.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function ConsecutiveAlerts() {
  const [alertStack, setAlertStack] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(undefined);

  useEffect(() => {
    if (alertStack.length && !alertMessage) {
      // Set a new snack when we don't have an active one
      setAlertMessage({ ...alertStack[0] });
      setAlertStack((prev) => prev.slice(1));
      setOpen(true);
    } else if (alertStack.length && alertMessage && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [alertStack, alertMessage, open]);

  const handleClick = (message) => () => {
    setAlertStack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setAlertMessage(undefined);
  };

  return (
    <div>
      <Button onClick={handleClick('Message A')}>Show message A</Button>
      <Button onClick={handleClick('Message B')}>Show message B</Button>
      <Snackbar
        key={alertMessage ? alertMessage.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
    </div>
  );
}