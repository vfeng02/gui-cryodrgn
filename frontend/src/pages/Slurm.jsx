import React from 'react';
import { useState } from "react";
import fields from '../slurm.json';
import { Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton, Switch,Alert, Snackbar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import '../App.css';
import './Slurm.css';
import { useLocation } from 'react-router-dom';
import PathSelect from "../components/PathSelect";

const Slurm = () => {
    const location = useLocation();
    const generatedCommand = location.state?.generatedCommand;
    const [values, setValues] = useState({});
    // const [slurmScript, setSlurmScript] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [runOutput, setRunOutput] = useState("");

    async function saveAndRun(slurm_script) {
        // const command = "sbatch";
        const command = "python3";

        // const path = values["dir"] + "/" + values["job name"] + ".slurm";
        const path = values["dir"] + "/" + values["job name"] + ".py";
        
        // const content=slurm_script;
        const content = "print('''" + slurm_script + "''')";
        
        const response = await fetch("http://localhost:3000/run", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"command": command, "path": path, "content": content})
        });
    
        if (!response.ok) {
            return "Error running script";
        }
        else {
            return response.json();
        }
    };

    async function generateSlurm(e) {
        e.preventDefault();
        let slurm_configs = "";
        let slurm_env = "module purge \nmodule load ";

        for (const [field_name, field_details] of Object.entries(fields["optional fields"])) {
            if (field_name == "conda version") {
                if (field_name in values) {
                    slurm_env += values[field_name] + "\n"
                }
                else {
                    slurm_env += field_details.default + "\n"
                }
            }
            else if (field_name == "shell") {
                if (field_name in values) {
                    slurm_configs += "#" + values[field_name] + "\n"
                }
                else {
                    slurm_configs += "#" + field_details.default + "\n"
                }
            }
            else if (field_details.type == "toggle") {
                if (field_name in values) { 
                    if (values[field_name]) { // the config should be added
                        slurm_configs += "#SBATCH " + field_details.flag + "\n"
                    }
                }
                else if (field_details.default) {
                    slurm_configs += "#SBATCH" + field_details.flag + "\n"
                }
            }
            else {
                if (field_name in values) {
                    slurm_configs += "#SBATCH " + field_details.flag + "=" + values[field_name] + "\n"
                }
                else {
                    if (field_name != "mail user") {
                        slurm_configs += "#SBATCH " + field_details.flag + "=" + field_details.default + "\n"
                    }
                }
            }
        }
        slurm_configs += "#SBATCH --job-name=" + values["job name"] + "\n \n";
        slurm_env += "conda activate " + values["conda env"] + "\n \n";
        
        let slurm_script = slurm_configs + slurm_env + generatedCommand;
        // let slurm_script = slurm_configs + slurm_env + "python hi.py > output.txt"; // script for testing on della

        const result = await saveAndRun(slurm_script);
        setRunOutput(result);
        setOpenAlert(true);
    };

    function updateField(fieldName, newValue) {
        setValues({
            ...values,
            [fieldName]: newValue,
        });
    };

    function updateChecked (fieldName, isChecked) {
        setValues({
            ...values,
            [fieldName]: isChecked ? true : false,
        });
    };

    function renderField(group_name, field_name, field_details) {
        if (field_details.type == "toggle") {
            return (
                <div className="toggle">
                  <Switch
                    key={field_name + "_toggle"}
                    className="toggle-switch"
                    checked={values[field_name] ?? field_details.default}
                    onChange={(e) => updateChecked(field_name, e.target.checked)}
                  />
                  <p>{(field_name in values) ? values[field_name].toString() : field_details.default.toString()}</p>
                </div>
              )
        }
        if (field_details.type == "path") {
            return (
                <PathSelect field_name={field_name} field_details={field_details} values={values} setValues={setValues}/>
              )
        }
        return (
            <input 
              data-toggle="tooltip" 
              data-placement="top" 
              title={field_details.help}
              type={field_details.type}
              step={field_details.type == "number" ? 1 : ""}
              required={group_name == "required fields"}
              onWheel={field_details.type == "number" ? ((e) => e.target.blur()) : undefined}
              placeholder={group_name == "required fields" ? "" : field_details.default}
              key = {field_name}
              onChange={(e) => updateField(field_name, e.target.value)}
            />
          )
    };

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert(false);
      };

    return (
        <div className="slurm">
            <h2>slurm job configurations</h2>
            <div className="go-back">
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
            <div className="output">
                <Snackbar 
                open={openAlert} 
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}} 
                autoHideDuration={10000} 
                onClose={handleClose}
                >
                <Alert onClose={handleClose} severity={runOutput == "Error running script" ? "error" : "success"} sx={{ width: '100%' }}>
                    {runOutput}
                </Alert>
                </Snackbar>
            </div>
            <div className="fields">
                <form onSubmit={e => generateSlurm(e)}>
                    <div className='accordion'>
                        {Object.entries(fields).map(([group_name, group_fields]) => (
                            <Accordion key={group_name+"_accordion"} defaultExpanded={group_name == "required fields"}>
                                <AccordionSummary key={group_name + "_name"} expandIcon={<ExpandMoreIcon />}><strong>{group_name}</strong></AccordionSummary>
                                <AccordionDetails key={group_name + "_details"}>
                                {Object.entries(group_fields).map(([field_name, field_details]) =>(
                                    <div key={field_name} className="field">
                                    <label>{field_name}</label>
                                    <Tooltip title={field_details.help}>
                                        <IconButton className="info-icon">
                                        <InfoOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {renderField(group_name, field_name, field_details)}
                                    </div>
                                ))}
                                </AccordionDetails>
                            </Accordion> 
                        ))}
                    </div>
                    <button type="submit" className='run-button' onClick={(e) => generateSlurm(e)}>Save and run slurm script</button>
                </form>
            </div>
        </div>
    );

}

export default Slurm;
