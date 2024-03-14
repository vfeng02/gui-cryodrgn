import React from 'react';
import '../App.css';
import {Snackbar, Alert} from "@mui/material";

const Warning = ( {openWarning, setOpenWarning, message} ) => {

  function handleCloseWarning(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  }

  return (
    <div>
      <Snackbar 
        open={openWarning} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}} 
        autoHideDuration={4000} 
        onClose={handleCloseWarning}
        >
        <Alert onClose={handleCloseWarning} severity="error" sx={{ width: '100%' }}>
        {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
 
export default Warning;