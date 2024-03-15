
import React from 'react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { TimeField } from '@mui/x-date-pickers/TimeField';
// import { LocalizationProvider, AdapterDayjs } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const StyledTimeField = styled(TimeField)({
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

const CustomTimeField = ( props ) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledTimeField
        label={props.name}
        helperText={props.help}
        id={props.id}
        name={props.name}
        key={props.id}
        value={props.value}
        required={props.required}
        onChange={props.onChange}
        // sx={{
        //   input: {
        //     "&::defaultValue": {    
        //       color: grey[500],
        //     }
        // }}}
        size="small"
        clearable
        margin={props.margin ?? "normal"}
        fullWidth
        format="HH:mm:ss"
        InputLabelProps={{ 
          shrink: true,
          style: { color: '#486AA8' },
        }}
        />
    </LocalizationProvider>
  )
};


export default CustomTimeField;