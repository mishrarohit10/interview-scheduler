import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar/SideBar';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleCreateJobClick = () => {
        navigate('/jobs/create');
    };

    return (
        <div>
            <Sidebar />
            <div className="content">
                <button onClick={handleCreateJobClick}>Create Jobs</button>
            </div>
        </div>
    );
};


export default Dashboard;