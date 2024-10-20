import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import VerifyEmail from './components/Auth/VerifyEmail';
import VerifySMS from './components/Auth/VerifySMS';
import CreateJob from './components/Job/CreateJob';
import Dashboard from './components/Job/Dashboard'; // Import the Dashboard component
import NavBar from './components/NavBar/NavBar';
import Verify from './components/Auth/Verify';

const App = () => {
    return (
        <Router>
            <NavBar/>
            <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/verify-sms" element={<VerifySMS />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/jobs/create" element={<CreateJob />} />
                <Route path="/dashboard" element={<Dashboard />} /> 
            </Routes>
        </Router>
    );
};

export default App;