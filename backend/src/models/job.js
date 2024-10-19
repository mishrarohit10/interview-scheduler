// src/models/job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior'],
        required: true,
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    endDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
