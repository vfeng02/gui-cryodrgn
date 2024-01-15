import React from 'react';
import commands from '../all_commands.json';
import CommandsList from "../components/CommandsList";

const Home = () => {

  return (
    <div className="home">
      { commands && <CommandsList commands={commands} /> }
    </div>
  );
}
 
export default Home;