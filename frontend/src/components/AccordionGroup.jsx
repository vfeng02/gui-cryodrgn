import React from 'react';
import dayjs from 'dayjs';
import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, MenuItem} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../App.css';
import './AccordionGroup.css';
import PathSelect from "./PathSelect";
import CustomTextField from './CustomTextField';
import ConstToggle from './ConstToggle';
import CustomTimeField from './CustomTimeField';

const AccordionGroup = ({ command_name, inputs, required_groups, conda_envs, values, setValues}) => {
    // const [expanded, setExpanded] = useState(false);

    function updateInput(arg_name, newValue) {
        setValues({
          ...values,
          [command_name]: {
              ...values[command_name],
              [arg_name]: newValue
          },
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
              command_name={command_name}
              arg_name={name} 
              key={name+"-path-select"}
              details={details} 
              required={required} 
              values={values} 
              setValues={setValues}/>
              )
            }
            else if (details.type == "conda") {
              return (
                <CustomTextField 
                name={name}
                label={name}
                id={name + "-conda-select"}
                help={details.help}
                value={values[command_name] ? (values[command_name][name] ?? "") : ""}
                select={true}
                required={required} 
                onChange={(e) => updateInput(name, e.target.value)}
                menuItems={(conda_envs).map((option) => (
                  <MenuItem className="menu-options" value={option}>{option}</MenuItem>
                  )
                  )}
                />
              ) 
            }
            else if (details.type == "time") {
              return (
                <CustomTimeField
                  name={name}
                  id={name + "-time-field"}
                  help={details.help}
                  value={values[command_name] ? (values[command_name][name] ?? dayjs(details.default)) : dayjs(details.default)}
                  // defaultValue={dayjs(details.default)}
                  select={true}
                  required={required} 
                  onChange={(newValue) => updateInput(name, newValue)}
                />
              ) 
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
                <ConstToggle
                command_name={command_name}
                label={details.flags ? details.flags.join(',') : name}
                arg_name={name}
                initialValue={values[command_name] ? ((name in values[command_name]) ? values[command_name][name] : details.default) : details.default}
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
              label={details.flags ? details.flags.join(',') : name}
              name={name}
              id={name + "_select"}
              help={details.help}
              value={values[command_name] ? (values[command_name][name] ?? "") : ""}
              placeholder={details.default}
              select={true}
              required={required}
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
            label={details.flags ? details.flags.join(',') : name}
            name={index == 0 ? name : ""}
            help={index == details.nargs-1 ? details.help : ""}
            type={type}
            step={step}
            margin="dense"
            onWheel={onWheel}
            required={required}
            value={values[command_name] ? values[command_name][name+index] : undefined}
            placeholder={details.default ? details.default.toString() : ""}
            id={name+index}
            onChange={(e) => updateInput(name+index, e.target.value)}
            />
            );
        }

        // use the command name as the default job name for slurm script, otherwise use the default given by argparse
        const placeholder = (name == "job name" ? command_name : (details.default ? details.default.toString() : ""))
    
        return (
            <CustomTextField 
            label={details.flags ? details.flags.join(',') : name}
            name={name}
            id={name + "-" + type}
            help={details.help}
            type={type}
            step={step}
            onWheel={onWheel}
            required={required}
            value={values[command_name] ? values[command_name][name] : undefined}
            placeholder={placeholder}
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
                      {renderInput((required_groups.has(group_name)) && !("default" in details), name, details)}
                      </div>
                  ))}
                  </AccordionDetails>
              </Accordion> 
            </div>
          ))}
          {/* <button onClick={() => setExpanded(true)}>Expand all</button>
          <button onClick={() => setExpanded(false)}>Collapse all</button> */}
    </div>
  );
}
 
export default AccordionGroup;