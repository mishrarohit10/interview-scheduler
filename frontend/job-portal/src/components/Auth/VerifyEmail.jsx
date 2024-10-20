import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const { token } = useParams(); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`https://interview-scheduler-0s3o.onrender.com/api/users/verify-email/${token}`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (!data.error) {
                    alert(data.message);
                    
                    if (data.companyName) {
                        console.log('companyName', data.companyName);
                        localStorage.setItem('companyName', data.companyName);
                    }

                    navigate('/dashboard'); 
                } else {
                    alert(data.message); 
                }
            } catch (error) {
                console.error('Error verifying email:', error);
                alert('Failed to verify email. Please try again.');
            }
        };

        verifyEmail();
    }, [token, navigate]); 

    return (
        <div>
            <h2>Email Verification</h2>
            <p>Verifying your email, please wait...</p>
        </div>
    );
};

export default VerifyEmail;
