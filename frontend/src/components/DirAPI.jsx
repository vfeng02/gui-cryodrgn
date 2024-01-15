import React from 'react';
import '../App.css';
import './Loading.css';

const DirAPI = () => {
  async function runScript(body) {
    const response = await fetch("http://localhost:3000/run", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.log("Error in running script")
    }

  }
  return (
    <div className="spinner">
        <span>Loading...</span>
        <div className="half-spinner"></div>
    </div>
  );
}
 
export default DirAPI;