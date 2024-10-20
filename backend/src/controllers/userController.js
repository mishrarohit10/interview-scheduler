import User from '../models/user.js';
import nodemailer from 'nodemailer'; // For sending emails
import twilio from 'twilio';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('accountSid:', accountSid);
console.log('authToken:', authToken);

// const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('twilioPhoneNumber:', twilioPhoneNumber);

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(403).json({ message: 'Please verify your email first.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful!', token, user: { email: user.email, mobile: user.mobile } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user.' });
    }
};

// User Registration
export const registerUser = async (req, res) => {
    const { name, phoneNumber, companyName, companyEmail, employeeSize } = req.body;

    try {
        // Validate input
        if (!name || !phoneNumber || !companyName || !companyEmail || !employeeSize) {
            return res.status(400).json({ message: 'All fields are required.', error: true });
        }

        // Check for valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(companyEmail)) {
            return res.status(400).json({ message: 'Invalid email format.', error: true });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ companyEmail });
        if (existingUser) {
            return res.status(200).json({ message: 'Email already exists. Details were not saved.', error: false });
        }

        // Create new user if email does not exist
        const user = new User({
            name,
            phoneNumber,
            companyName,
            companyEmail,
            employeeSize,
        });
        await user.save();

        res.status(201).json({ message: 'Details saved successfully', error: false });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.', error: true });
    }
};


// Email Verification
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    console.log(token, 'token');

    try {
        // Find the user by the verification token
        const user = await User.findOne({ emailToken: token });

        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'Invalid token.', error: true  });
        }

        // Check if the token has expired
        if (Date.now() > user.verificationTokenExpiry) {
            return res.status(400).json({ message: 'Token has expired.', error: true });
        }

        // Verify the email
        user.emailVerified = false;
        user.verificationToken = undefined; 
        user.verificationTokenExpiry = undefined; 
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!', companyName: user.companyName,error: false });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Error verifying email.' });
    }
};

export const getEmail = async (req, res) => {
    const { companyEmail } = req.body; 

    // Generate a random verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    console.log('Verification Token:', verificationToken);

    const tokenExpiry = Date.now() + 3600000; // Set token expiry to 1 hour from now

    try {
        // Check if the email exists in the database
        const user = await User.findOne({ companyEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found.', error: false });
        }

        user.emailToken = verificationToken;
        user.emailTokenExpiry = tokenExpiry;

        console.log('User:', user.emailToken);

        await user.save();

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: companyEmail,
            subject: 'Email Verification',
            html: `<p>Click <a href="http://localhost:5173/verify-email/${verificationToken}">here</a> to verify your email.</p>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification email sent.', error: false });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: 'Error sending verification email.' });
    }
};


