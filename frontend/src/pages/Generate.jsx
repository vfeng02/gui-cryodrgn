import React from 'react';
import { useState } from "react";
import '../App.css';
import './Generate.css';
import Error from "../components/Error";
import { useLocation, Link } from 'react-router-dom';
import AccordionGroup from "../components/AccordionGroup";
import ResultBar from "../components/ResultBar";


const Generate = () => {
  const location = useLocation();
  const [command_name, command_args] = location.state?.fromCommand;
  const [generated, setGenerated] = useState("");
  const [argValues, setArgValues] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  function generateCommand(e) {
    e.preventDefault();
    let result = "cryodrgn " + command_name + " ";

    for (const [_, args_in_group] of Object.entries(command_args)) {
      for (const [arg_name, arg_details] of Object.entries(args_in_group)) {
        if (arg_name in argValues && argValues[arg_name].toString().length > 0) {
          if ("const" in arg_details) {
            if (argValues[arg_name] != arg_details.default) {
              result += arg_details.flags[0] + " "
            }
          }
          else {
            if ("flags" in arg_details) {
              result += arg_details.flags[0] + " "
            }
            result += argValues[arg_name] + " "
          }
        }
        else if ("nargs" in arg_details && arg_details.nargs > 1) {
          let multiple_values = ""
          for (let i = 0; i < arg_details.nargs; i++) {
            // does not handle the case when one or multiple values are missing
            if ((arg_name+i) in argValues && argValues[(arg_name+i)] != null) {
              multiple_values += argValues[(arg_name+i)] + " "
            }
          }
          // check for >2 when user types then deletes their input to the multiple argument
          if ((multiple_values.length) > 2) {
            if ("flags" in arg_details) {
              result += arg_details.flags[0] + " "
            }
            result += multiple_values + " "
          }
        }
      } 
    }

    setGenerated(result);
    setAlertMessage("Command generated!");
    setOpenAlert(true);
    return false;
  }

  return (
    <div className="generate">
      {generated && 
      <ResultBar 
      generated={generated} 
      openAlert={openAlert}
      setOpenAlert={setOpenAlert}
      alertMessage={alertMessage}
      setAlertMessage={setAlertMessage}
      />
      }
      {command_args ? (
        <div>
          <h2 className='title-h2' style={(generated.length > 0) ? { top: "140px" } : { top: "60px" }}>{command_name}</h2>
          <div className="arguments">
            <form onSubmit={e => generateCommand(e)}>
              <AccordionGroup 
              inputs={command_args} 
              required_groups={new Set(["positional arguments"])}
              values={argValues}
              setValues={setArgValues}
               />
              <button type="submit">Generate Command</button>
            </form>
            <div className="slurm-link">
              <Link to={"/slurm"} state={{generatedCommand: generated}}>
                <button className="secondary-button">Run Slurm Script</button>
              </Link>
            </div>
          </div>
        </div>
      ) : <Error errorMessage="Data for this command does not exist" />}
    </div>
  );
}
 
export default Generate;