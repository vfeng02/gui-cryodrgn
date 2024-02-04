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
import AccordionGroup from "../components/AccordionGroup";

const Slurm = () => {
    const location = useLocation();
    const generatedCommand = location.state?.generatedCommand;
    const [values, setValues] = useState({});
    const [openAlert, setOpenAlert] = useState(false);
    const [runOutput, setRunOutput] = useState("");

    async function saveAndRun(command, path, content) {
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

    // async function getCondaEnvs() {
    //   const response = await fetch("http://localhost:3000/run", {
    //       method: 'POST',
    //       headers: {
    //           'Content-Type': 'application/json'
    //       },
    //       // body: JSON.stringify({"command": command, "path": path, "content": content})
    //   });
  
    //   if (!response.ok) {
    //       return "Error fetching conda environments";
    //   }
    //   else {
    //       return response.json();
    //   }
    // };

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
            else if ("const" in field_details) {
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

        // const path = values["dir"] + "/" + values["job name"] + ".py";
        // const result = await saveAndRun("python3", path, "print('''" + slurm_script + "''')");
        
        const path = values["dir"] + "/" + values["job name"] + ".slurm";
        const result = await saveAndRun("sbatch", path, slurm_configs + slurm_env + "python hi.py > output.txt");

        setRunOutput(result);
        setOpenAlert(true);
    };

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert(false);
      };

    return (
        <div className="slurm">
            <h2 className='title-h2'>slurm job configurations</h2>
            <div className="go-back">
                <button className="secondary-button" onClick={() => window.history.back()}>Go Back</button>
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
                  <AccordionGroup 
                  inputs={fields} 
                  required_groups={new Set(["required fields"])}
                  values={values}
                  setValues={setValues}
                  />
                    <button type="submit" className='run-button' onClick={(e) => generateSlurm(e)}>Save and run slurm script</button>
                </form>
            </div>
        </div>
    );

}

export default Slurm;
