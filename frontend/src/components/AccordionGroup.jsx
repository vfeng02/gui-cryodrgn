import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, MenuItem, Typography, Switch, FormLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../App.css';
import './AccordionGroup.css';
import PathSelect from "./PathSelect";
import CustomTextField from './CustomTextField';
import ConstToggle from './ConstToggle';

const AccordionGroup = ({ inputs, required_groups, values, setValues }) => {
    function updateInput(name, newValue) {
        setValues({
            ...values,
            [name]: newValue,
        });
    };

    function renderInput(required, name, details) {
        let type = "text";
        let step = "";
        let onWheel;

        if ("type" in details) {
            // render directory/file selection and return (for command generation and slurm pages)
            if (details.type == "abspath") {
              return (
              <PathSelect 
              name={name} 
              key={name+"-path-select"}
              details={details} 
              required={required} 
              values={values} 
              setValues={setValues}/>)
            }
            else {
              type = "number";
              step = "1";
              onWheel = (e) => e.target.blur();
              if (details.type == "float") {
                step = "any";
              }
            }
        }
      
        // render toggle and return (for command generation and slurm pages)
        if ("const" in details) {
            return (
                <div key={name+"-toggle-container"} className="toggle">
                {/* <FormLabel sx={{color: '#486AA8', fontSize: '0.75em'}}>{name}</FormLabel>
                <div className="toggle-switch">
                  <Switch
                    // key={name + "_toggle"}
                    checked={values[name] ?? details.default}
                    onChange={(e) => updateChecked(name, e.target.checked)}
                  />
                  <p>{(values[name] ?? details.default) ? "true" : "false"}</p>
                </div> */}
                {/* <CustomTextField
                name={name}
                id={name + "_toggle"}
                inputProps={{endAdornment: <Switch
                  checked={values[name] ?? details.default}
                  onChange={(e) => updateChecked(name, e.target.checked)}
                />}}
                menuItems={<p>{(values[name] ?? details.default) ? "true" : "false"}</p>}
                /> */}
                <ConstToggle
                name={name}
                initialValue={values[name] ?? details.default}
                help={details.help}
                values={values}
                setValues={setValues}
                />
                
                </div>
            )
        }
    
        // render dropdown select and return (only for command generation page)
        if ("choices" in details) {
            return (
              <CustomTextField 
              name={name}
              id={name + "_select"}
              help={details.help}
              value={values[name] ?? ""}
              placeholder={details.default.toString()}
              select={true}
              onChange={(e) => updateInput(name, e.target.value)}
              menuItems={(details.choices).map((option) => (
                <MenuItem className="menu-options" value={option}>{option}</MenuItem>
                )
                )}
              />
            )
        }
    
        // render multiple input selection (only for command generation page)
        if ("nargs" in details && details.nargs > 0) {
            const nInputs = new Array(details.nargs)
            for (var i = 0; i < details.nargs; i++) {
                nInputs[i] = i;
            };
    
            return (nInputs).map((index) => 
            <CustomTextField
            name={index == 0 ? name : ""}
            help={index == details.nargs-1 ? details.help : ""}
            type={type}
            step={step}
            margin="dense"
            onWheel={onWheel}
            required={required}
            placeholder={details.default ? details.default.toString() : ""}
            id={name+index}
            onChange={(e) => updateInput(name+index, e.target.value)}
            />
            );
        }
    
        return (
            <CustomTextField 
            name={name}
            id={name + "-" + type}
            help={details.help}
            type={type}
            step={step}
            onWheel={onWheel}
            required = {required}
            placeholder={details.default ? details.default.toString() : ""}
            onChange={(e) => updateInput(name, e.target.value)}
            />
        );
    }

    return (
      <div className='accordion-group'>
          {Object.entries(inputs).map(([group_name, group_inputs]) => (
            <div className='accordion'>
              <Accordion key={group_name+"-accordion"} defaultExpanded={required_groups.has(group_name)}>
                  <AccordionSummary key={group_name + "-name"} expandIcon={<ExpandMoreIcon />}><strong>{group_name}</strong></AccordionSummary>
                  <AccordionDetails key={group_name + "-details"}>
                  {Object.entries(group_inputs).map(([name, details]) =>(
                      <div key={name+"-container"} className="input-container">
                      {renderInput((required_groups.has(group_name)), name, details)}
                      </div>
                  ))}
                  </AccordionDetails>
              </Accordion> 
            </div>
          ))}
          <Typography>Testing</Typography>
    </div>
  );
}
 
export default AccordionGroup;