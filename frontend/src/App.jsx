import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Slurm from './pages/Slurm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route exact path='/generate' element={<Generate/>} />
            <Route exact path='/slurm' element={<Slurm/>} />
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


