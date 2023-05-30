import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Auth from './components/Auth/Auth.component';
import Home from './components/Home/Home.component';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
            <Routes>
                <Route path="/" index element={<Home/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/login" element={<Auth/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;