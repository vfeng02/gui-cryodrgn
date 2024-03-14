import React from 'react';
import '../App.css';
import './CommandCard.css';
import {Card, Button, Typography, CardContent, CardActions} from '@mui/material';

const CommandCard = ( {commandName, generatedCommand, argValues} ) => {
  return (
    <div className="command-card">
      <CardContent>
      <Typography sx={{ fontSize: 14 }} color="primary">
        Command:
      </Typography>
      <Typography variant="h5" component="div" gutterBottom>
        {commandName}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="primary">
        {generatedCommand}
      </Typography>
      <Typography variant="body2" color="primary" gutterBottom>
        Configured arguments:
      </Typography>
      {console.log(argValues[commandName])}
      {Object.entries(argValues[commandName]).map(([arg_name, arg_value]) =>
      <Typography variant="body2"><strong>{arg_name}</strong> {arg_value}</Typography>
      )}
    </CardContent>
    <CardActions>
      <Button onClick={() => window.history.back()} size="small" color="secondary">Edit</Button>
    </CardActions>
    </div>
  );
}
 
export default CommandCard;