
import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { TextField } from '@mui/material';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#A9B6D4',
    },
    '&:hover fieldset': {
      borderColor: '#486AA8',
    },
    color: '#486AA8',
  },
});

const CustomTextField = ( props ) => {
  const theme = useTheme();

  return (
    <StyledTextField
    label={props.name}
    helperText={props.help}
    type={props.type}
    step={props.step}
    onWheel={props.onWheel}
    id={props.id}
    name={props.name}
    key={props.id}
    value={props.value}
    required={props.required}
    placeholder={props.placeholder}
    readOnly={props.readOnly}
    onChange={props.onChange}
    onClick={props.onClick}
    select={props.select}
    InputProps={props.inputProps}
    sx={{
      input: {
        "&::placeholder": {    
           color: grey[500],
        }
    }}}
    size="small"
    margin={props.margin ?? "normal"}
    fullWidth
    InputLabelProps={{ 
      shrink: true,
      style: { color: '#486AA8' },
    }}
    >
      {props.menuItems}
    </StyledTextField>
  )
};


export default CustomTextField;