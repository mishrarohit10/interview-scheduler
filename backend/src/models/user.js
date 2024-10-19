import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        // unique: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    mobileVerified: {
        type: Boolean,
        default: false,
    },
    emailToken: String,  
    otp: String,  
    otpExpiry: Date, 
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

