import React from 'react';
import { useState } from "react";
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Slurm from './pages/Slurm';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#486AA8',
    },
    secondary: {
      main: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Sometype Mono',
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: '0.5px solid',
          borderColor: '#4F69A3',
          color: grey[500],
          "&.Mui-selected": {
            // border: '1px solid',
            borderColor: '#A9B6D4',
            backgroundColor: '#A9B6D4',
            color: grey[50]
          },
          "&.Mui-selected:hover": {
            // color: '#000000',
            borderColor: grey[400],
            backgroundColor: grey[400]
          },
          "&:hover": {
            border: '1px solid',
            borderColor: '#4F69A3',
            backgroundColor: '#ffffff'
          }
        }
      }
    },
  }
});

function App() {
  const [argValues, setArgValues] = useState({});
  const [slurmValues, setSlurmValues] = useState({});
  
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Routes>
            <Route exact path='/' key="route1" element={<Home/>} />
            <Route exact path='/generate' key="route1" element={<Generate argValues={argValues} setArgValues={setArgValues}/>} />
            <Route exact path='/slurm' key="route1" element={<Slurm argValues={argValues} values={slurmValues} setValues={setSlurmValues}/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;


