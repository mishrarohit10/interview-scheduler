import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../global.css';
import phone from '../../assets/phone-icon.svg';
import groupIcon from '../../assets/groups-icon.svg';
import mailIcon from '../../assets/mail-icon.svg';
import personIcon from '../../assets/person-icon.svg';

const Signup = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [employeeSize, setEmployeeSize] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate phone number: starts with + and followed by digits
        if (!/^\+\d{10,15}$/.test(phoneNumber)) { 
            alert('Please enter a valid phone number with country code, starting with +.');
            return;
        }

        // Validate name: no numbers or special characters
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            alert('Name should only contain letters and spaces.');
            return;
        }

        
        if (employeeSize <= 0) {
            alert('Employee size should be a positive number.');
            return;
        }

        try {
            const response = await api.post('/users/signup', {
                name,
                phoneNumber,
                companyName,
                employeeSize,
                companyEmail,
            });

            if (response.data.error === false) {
                alert(response.data.message); 
                navigate('/verify'); 
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Error during signup. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <div className="left-side">
                <h2>Welcome to Our Platform</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="right-side">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            minLength="2"
                            pattern="^[a-zA-Z\s]+$" 
                            title="Name should only contain letters and spaces."
                        />
                        <img src={personIcon} alt="Name Icon" className="icon" />
                    </div>
                    <div className="form-group phone-input">
                        <input 
                            type="tel" 
                            placeholder="+91 Phone Number"
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            required 
                            pattern="^\+\d{10,15}$" 
                            title="Phone number must start with + and contain only digits."
                        />
                        <img src={phone} alt="Phone Icon" className="icon" />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="Company Name" 
                            value={companyName} 
                            onChange={(e) => setCompanyName(e.target.value)} 
                            required 
                            minLength="2"
                        />
                        <img src={personIcon} alt="Company Icon" className="icon" />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Company Email" 
                            value={companyEmail} 
                            onChange={(e) => setCompanyEmail(e.target.value)} 
                            required 
                        />
                        <img src={mailIcon} alt="Email Icon" className="icon" />
                    </div>
                    <div className="form-group">
                        <input 
                            type="number" 
                            placeholder="Employee Size" 
                            value={employeeSize} 
                            onChange={(e) => setEmployeeSize(e.target.value)} 
                            required 
                            min="1"
                            title="Employee size should be a positive number."
                        />
                        <img src={groupIcon} alt="Employees Icon" className="icon" />
                    </div>
                    <button type="submit" className="proceed-button">Proceed</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
