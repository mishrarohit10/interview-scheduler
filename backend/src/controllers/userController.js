import User from '../models/user.js';
import nodemailer from 'nodemailer'; // For sending emails
import twilio from 'twilio';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('accountSid:', accountSid);
console.log('authToken:', authToken);

const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('twilioPhoneNumber:', twilioPhoneNumber);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

        // Optionally, return user data or a token here
        res.status(200).json({ message: 'Login successful!', user: { email: user.email, mobile: user.mobile } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user.' });
    }
};

// User Registration
export const registerUser = async (req, res) => {
    const { email, mobile, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailToken = crypto.randomBytes(32).toString('hex'); // Generate token for email verification
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        const otpExpiry = Date.now() + 3600000; // OTP valid for 1 hour

        const user = new User({
            email,
            mobile,
            password: hashedPassword,
            emailToken,
            otp,
            otpExpiry
        });
        await user.save();

        // Send Email Verification
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify Your Email',
                html: `<p>Click <a href="http://localhost:5000/api/users/verify-email/${emailToken}">here</a> to verify your email.</p>`,
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            // Optionally, you can delete the user if email sending fails
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: 'Error sending verification email. Please try again.' });
        }

        // Send OTP via SMS
        // try {
        //     await twilioClient.messages.create({
        //         body: `Your OTP is: ${otp}`,
        //         from: twilioPhoneNumber,
        //         to: mobile,
        //     });
        // } catch (smsError) {
        //     console.error('Error sending OTP via SMS:', smsError);
        //     // Optionally, you can delete the user if SMS sending fails
        //     await User.findByIdAndDelete(user._id);
        //     return res.status(500).json({ message: 'Error sending OTP via SMS. Please try again.' });
        // }

        res.status(201).json({ message: 'User registered successfully! Check your email and SMS for verification.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
};

// Email Verification
export const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ emailToken: token });
        if (!user) {
            return res.status(404).json({ message: 'Invalid token.' });
        }

        user.emailVerified = true;
        user.emailToken = undefined; // Clear the token after verification
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Error verifying email.' });
    }
};

// Phone Verification
export const verifySMS = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if OTP is valid and not expired
        if (user.otp === otp && Date.now() < user.otpExpiry) {
            user.mobileVerified = true;
            user.otp = undefined; // Clear the OTP after verification
            user.otpExpiry = undefined; // Clear expiry
            await user.save();

            res.status(200).json({ message: 'Mobile number verified successfully!' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
    } catch (error) {
        console.error('Error verifying mobile number:', error);
        res.status(500).json({ message: 'Error verifying mobile number.' });
    }
};
