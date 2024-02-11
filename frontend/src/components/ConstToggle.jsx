import React from 'react';
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup, FormLabel } from '@mui/material';
import '../App.css';
import './ConstToggle.css';


const ConstToggle = ({  command_name, arg_name, initialValue, help, values, setValues }) => {
  const [toggle, setToggle] = useState(initialValue);

  const handleChange = (event, isTrue) => {
    if (isTrue != null) { //enforce that at least one button must be active, i.e. cannot be deselected
      setToggle(isTrue);
      setValues({
        ...values,
        [command_name]: {
            ...values[command_name],
            [arg_name]: isTrue ? "true" : "false"
        },
      });
    }
  };

  return (
    <div className='toggle-container'>
      <div className='toggle-button-container'>
        <FormLabel className='toggle-label' sx={{color: '#486AA8', backgroundColor:'#ffffff', fontSize: '0.75em', borderRadius: '16px', textAlign: 'center', paddingRight:'0'}}>
          {arg_name}</FormLabel>
        <ToggleButtonGroup
          className='toggle-button'
          value={toggle}
          key={arg_name+"-toggle-button"}
          exclusive
          fullWidth
          size="small"
          onChange={handleChange}
        >
          <ToggleButton value={true}>true</ToggleButton>
          <ToggleButton value={false}>false</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <p>{help}</p>
    </div>
  );
  
}
 
export default ConstToggle;