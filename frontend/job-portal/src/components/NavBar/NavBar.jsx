import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/company-logo.svg';
import profilepic from '../../assets/grey-circle.svg';
import arrowDown from '../../assets/grey-arrow.svg';

const Navbar = () => {
    const location = useLocation();
    const isDashboardOrJobs = location.pathname.includes('dashboard') || location.pathname.includes('jobs');

    const username = localStorage.getItem('companyName');
    console.log('Username:', username);

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logo} alt="Company Logo" className="company-logo" /> 
            </div>
            <div className="nav-right">
                <div className="right-section">
                    {isDashboardOrJobs ? (
                        <button className="contact-button">Contact</button>
                    ) : (
                        <button className="contact-button">Contact</button>
                    )}
                    {isDashboardOrJobs && (
                        <div className="profile-section">
                            <img src={profilepic} alt="Profile" className="profile-pic" />
                            <span className="username">{username}</span>
                            <img src={arrowDown} alt="Dropdown Icon" className="dropdown-icon" />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
