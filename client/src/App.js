import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Register from './components/Register'; 
import Login from './components/Login'; 
import Convert from './components/Convert';
import History from './components/History';

function App() {
    return (
      <Router>
        <div className="App">
          <Header /> {}
          <Routes>
            <Route path="/register" element={<Register />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Convert />} />
            <Route path="/exchange-history" element={<History />} />
          </Routes>
        </div>
      </Router>
    );
}

export default App;