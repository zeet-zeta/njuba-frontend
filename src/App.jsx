import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login.jsx';
import Register from './register.jsx';
import Home from './home.jsx';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;