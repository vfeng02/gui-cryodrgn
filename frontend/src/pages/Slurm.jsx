import React from 'react';
import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material"
import fields from '../slurm.json';
import '../App.css';
import './Slurm.css';
import { useLocation } from 'react-router-dom';
import CommandCard from '../components/CommandCard';
import AccordionGroup from '../components/AccordionGroup';

const Slurm = ( {argValues, values, setValues} ) => {
    const location = useLocation();
    const generatedCommand = location.state?.generatedCommand;
    const commandName = location.state?.commandName;
    const [openAlert, setOpenAlert] = useState(false);
    const [runOutput, setRunOutput] = useState("");
    const [condaEnvs, setCondaEnvs] = useState([]);

    // console.log(values);
    async function saveAndRun(command, path, content) {
        const response = await fetch("/run", {
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

    async function getCondaEnvs() {
      const response = await fetch("/envs", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
      });

      if (!response.ok) {
          return "Error fetching conda environments";
      }
      const envs = await response.json();
      setCondaEnvs(envs);
    };

    useEffect(() => {
      getCondaEnvs();
    },[]);

    async function generateSlurm(e) {
        e.preventDefault();
        let slurm_configs = "";
        let slurm_env = "module purge \nmodule load ";

        for (const [field_name, field_details] of Object.entries(fields["optional fields"])) {
            if (field_name == "conda version") {
                if (field_name in values[commandName]) {
                    slurm_env += values[commandName][field_name] + "\n"
                }
                else {
                    slurm_env += field_details.default + "\n"
                }
            }
            else if (field_name == "shell") {
                if (field_name in values[commandName]) {
                    slurm_configs += "#" + values[commandName][field_name] + "\n"
                }
                else {
                    slurm_configs += "#" + field_details.default + "\n"
                }
            }
            else if ("const" in field_details) {
                if (field_name in values[commandName]) { 
                    if (values[commandName][field_name]) { // the config should be added
                        slurm_configs += "#SBATCH " + field_details.flag + "\n"
                    }
                }
                else if (field_details.default) {
                    slurm_configs += "#SBATCH" + field_details.flag + "\n"
                }
            }
            else {
                if (field_name in values[commandName]) {
                    slurm_configs += "#SBATCH " + field_details.flag + "=" + values[commandName][field_name] + "\n"
                }
                else {
                    if (field_name != "mail user") {
                        slurm_configs += "#SBATCH " + field_details.flag + "=" + field_details.default + "\n"
                    }
                }
            }
        }
        slurm_configs += "#SBATCH --job-name=" + values[commandName]["job name"] + "\n \n";
        slurm_env += "conda activate " + values[commandName]["conda env"] + "\n \n";
        
        let slurm_script = slurm_configs + slurm_env + generatedCommand;

        // const path = values[commandName]["dir"] + "/" + values[commandName]["job name"] + ".py";
        // const result = await saveAndRun("python3", path, "print('''" + slurm_script + "''')");
        
        const path = values[commandName]["dir"] + "/" + values[commandName]["job name"] + ".slurm";
        // const result = await saveAndRun("sbatch", path, slurm_configs + slurm_env + "python hi.py > output.txt")
        const result = await saveAndRun("sbatch", path, slurm_script);


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
            <div className="command-card-container">
                <CommandCard commandName={commandName} generatedCommand={generatedCommand} argValues={argValues}/>
            </div>
            <div className="accordion-group-container">
                <form onSubmit={e => generateSlurm(e)}>
                  <AccordionGroup 
                  command_name={commandName}
                  inputs={fields} 
                  required_groups={new Set(["required fields"])}
                  conda_envs={condaEnvs}
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
