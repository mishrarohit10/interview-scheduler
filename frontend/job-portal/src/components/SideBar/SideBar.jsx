import React from 'react';
import '../../global.css';
import home from '../../assets/grey-home.svg';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={home} alt="Home" />
            </div>
        </div>
    );
};

export default Sidebar;
