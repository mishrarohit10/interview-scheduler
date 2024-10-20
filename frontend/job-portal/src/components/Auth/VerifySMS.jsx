// src/components/Auth/VerifySMS.jsx
import React, { useState } from 'react';

const VerifySMS = () => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleVerifySMS = async (e) => {
        e.preventDefault(); 

        try {
            const response = await fetch('http://localhost:5000/api/users/verify-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile, otp }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error verifying SMS:', error);
            setMessage('Failed to verify SMS. Please try again.');
        }
    };

    return (
        <div>
            <h2>Mobile Verification</h2>
            <form onSubmit={handleVerifySMS}>
                <div>
                    <label htmlFor="mobile">Mobile Number:</label>
                    <input
                        type="text"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="otp">OTP:</label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Verify</button>
            </form>
            {message && <p>{message}</p>} 
        </div>
    );
};

export default VerifySMS;
