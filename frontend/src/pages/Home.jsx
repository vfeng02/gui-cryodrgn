import React from 'react';
import commands from '../../../data/commands.json';
import { Link } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../App.css';
import './Home.css';

const Home = () => {
  return (
    <div className="command-list">
      {Object.entries(commands).map(([command_group, command_names]) => (
        <div className="accordion">
          <Accordion key={command_group+"_accordion"}>
            <AccordionSummary key={command_group + "_name"} expandIcon={<ExpandMoreIcon />}><h3>{command_group}</h3></AccordionSummary>
            <AccordionDetails key={command_group + "_commands"}>
            {Object.entries(command_names).map(([command_name,command_info]) => (
              <div className="command-preview" key={command_name+"_summary"} >
              <Link to={"/generate"} key={"link"+command_name} state={{fromCommand: [command_name, command_info.args]}}>
                  <h2>{ command_name }</h2>
                  <p>{ command_info.desc }</p>
              </Link>
              </div>
            ))}
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
 
export default Home;