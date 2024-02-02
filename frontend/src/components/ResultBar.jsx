import React from 'react';
import '../App.css';
import './ResultBar.css';
import { Alert, Snackbar, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const ResultBar = ( {generated, openAlert, setOpenAlert, alertMessage, setAlertMessage} ) => {
  const handleExited = () => {
    setAlertMessage(undefined);
  };

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <div className="result-bar"> 
        <h3>{generated}</h3>
        <CopyToClipboard 
          className="copy"
          text={generated}
          onCopy={() => {
            openAlert ? handleClose() : undefined;
            setAlertMessage("Copied to clipboard!");
            setOpenAlert(true);
          }}>
          <IconButton className="copy-icon" 
          sx={{
            height: 40, marginRight: '30px',
            }}>
            <ContentCopyIcon />
          </IconButton>
        </CopyToClipboard>
        
        <Snackbar 
          open={openAlert} 
          anchorOrigin={{ vertical: 'top', horizontal: 'right'}} 
          autoHideDuration={9000} 
          onClose={handleClose}
          TransitionProps={{ onExited: handleExited }}
          >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
        </div>
  );
}
 
export default ResultBar;