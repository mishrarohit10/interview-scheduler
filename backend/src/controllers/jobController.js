import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Job from '../models/job.js'; 

dotenv.config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const createJob = async (req, res) => {
    const { jobTitle, jobDescription, experienceLevel, endDate, candidates } = req.body;

    try {
        const job = new Job({
            jobTitle,
            jobDescription,
            experienceLevel,
            endDate,
        });
        await job.save();

        // Send notification emails to candidates
        for (const email of candidates) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'New Job Posting: ' + jobTitle,
                html: `<p>A new job has been posted that matches your profile:</p>
                       <p><strong>Job Title:</strong> ${jobTitle}</p>
                       <p><strong>Description:</strong> ${jobDescription}</p>
                       <p><strong>Experience Level:</strong> ${experienceLevel}</p>
                       <p><strong>End Date:</strong> ${endDate}</p>`,
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error('Error sending email to', email, ':', emailError);
            }
        }

        res.status(201).json({ message: 'Job created successfully and notifications sent!', job });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job.' });
    }
};