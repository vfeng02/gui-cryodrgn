import React from 'react';
import '../App.css';
import './SlurmCard.css';
import {CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const SlurmCard = ( {commandName, generatedCommand, argValues} ) => {
  return (
    <div className='slurm-card'>
      <div className="command-card">
      <CardContent>
      <Accordion sx={{ borderColor: 'primary.main' }}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </CardContent>
    </div>
    </div>
  );
}
 
export default SlurmCard;