import React, { useState } from 'react';
import api from '../../api';
import '../../global.css';
import Sidebar from '../SideBar/SideBar';

const CreateJob = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [endDate, setEndDate] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [currentCandidate, setCurrentCandidate] = useState(''); 

    const handleCandidateKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (currentCandidate && !candidates.includes(currentCandidate)) {
                setCandidates([...candidates, currentCandidate]);
                setCurrentCandidate(''); 
            }
        }
    };

    const experienceLevels = [
        { value: 'Entry', label: 'Entry' },
        { value: 'Mid', label: 'Mid' },
        { value: 'Senior', label: 'Senior' }
    ];

    const handleCandidateRemove = (index) => {
        const newCandidates = [...candidates];
        newCandidates.splice(index, 1); // Remove candidate at index
        setCandidates(newCandidates);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await api.post('/jobs/create-job', {
                jobTitle,
                jobDescription,
                experienceLevel,
                endDate,
                candidates,
            });

            alert('Job created successfully!');
            // Reset the form
            setJobTitle('');
            setJobDescription('');
            setExperienceLevel('');
            setEndDate('');
            setCandidates([]);
            setCurrentCandidate('');
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Error creating job. Please try again.');
        }
    };

    return (
        <>
        <Sidebar />
        <div className="create-job-container">
            <form onSubmit={handleSubmit} className="create-job-form">
                <div className="form-group">
                    <label>Job Title:</label>
                    <input 
                        type="text" 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)} 
                        required 
                        placeholder="Enter job title"
                    />
                </div>
                <div className="form-group">
                    <label>Job Description:</label>
                    <textarea 
                        value={jobDescription} 
                        onChange={(e) => setJobDescription(e.target.value)} 
                        required 
                        placeholder="Enter job description"
                    />
                </div>
                <div className="form-group">
                    <label>Experience Level:</label>
                    <select 
                        className="experience-select" 
                        value={experienceLevel} 
                        onChange={(e) => setExperienceLevel(e.target.value)} 
                        required
                    >
                        <option value="">Select Experience Level</option>
                        {experienceLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>End Date:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Candidates:</label>
                    <div className="tags-input">
                        {candidates.map((candidate, index) => (
                            <div key={index} className="tag">
                                {candidate}
                                <span className="remove-tag" onClick={() => handleCandidateRemove(index)}>x</span>
                            </div>
                        ))}
                        <input 
                            type="text" 
                            value={currentCandidate} 
                            onChange={(e) => setCurrentCandidate(e.target.value)} 
                            onKeyDown={handleCandidateKeyDown} 
                            placeholder="Enter candidate email"
                        />
                    </div>
                </div>
                <button type="submit">Create Job</button>
            </form>
        </div>
        </>
    );
};

export default CreateJob;












