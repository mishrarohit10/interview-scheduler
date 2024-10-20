// src/components/Auth/Verify.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api'; 
import '../../global.css';
import mail from '../../assets/mail-icon.svg';
import phone from '../../assets/phone-icon.svg';

const Verify = () => {
    const { token } = useParams(); 
    const [email, setEmail] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [smsVerified, setSmsVerified] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [smsError, setSmsError] = useState(false);

    const handleEmailVerify = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const response = await api.post('/users/verify-email', { companyEmail: email });
            if (response.data.error === false) {
                setEmailError(false);
                alert('Email verification sent successfully!');
            } else {
                setEmailError(true);
                setEmailVerified(false);
                alert('Email verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            setEmailError(true);
            alert('Error verifying email. Please try again.');
        }
    };

    const handleSmsVerify = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const response = await api.post('/users/verify-sms', { code: smsCode });
            if (response.ok) {
                setSmsVerified(true);
                setSmsError(false);
                alert('SMS verification successful!');
            } else {
                setSmsError(true);
                setSmsVerified(false);
                alert('SMS verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying SMS:', error);
            setSmsError(true);
            alert('Error verifying SMS. Please try again.');
        }
    };

    return (
        <div className="verify-container">
            <div className="left-side">
                <h2>Verification Process</h2>
                <p>
                    Please enter the verification codes sent to your email and phone number to proceed.
                </p>
            </div>
            <div className="right-side">
                <form className="verify-form">
                    <h2>Verify</h2>
                    <div className="verify-form-group">
                        <input 
                            type="text" 
                            placeholder="Verify Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <img src={mail} alt="Email Verification Icon" className="verify-icon" />
                        <button type="submit" className="proceed-button" onClick={handleEmailVerify}>Verify Email</button>
                        {emailVerified && <span className="status-icon green-tick">✔️</span>}
                        {emailError && <span className="status-icon red-cross">✖️</span>}
                    </div>
                    <div className="verify-form-group">
                        <input 
                            type="text" 
                            placeholder="Verify SMS" 
                            value={smsCode} 
                            onChange={(e) => setSmsCode(e.target.value)} 
                            required 
                        />
                        <img src={phone} alt="SMS Verification Icon" className="verify-icon" />
                        <button type="submit" className="proceed-button" onClick={handleSmsVerify}>Verify SMS</button>
                        {smsVerified && <span className="status-icon green-tick">✔️</span>}
                        {smsError && <span className="status-icon red-cross">✖️</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Verify;
