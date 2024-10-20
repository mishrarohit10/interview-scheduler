import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: false,
    },
    companyName: {
        type: String,
        required: true,
    },
    employeeSize: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
        unique: false, 
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    mobileVerified: {
        type: Boolean,
        default: false,
    },
    emailToken: {
        type: String,
        default: null,
    },
    emailTokenExpiry: {
        type: Date,  
        default: null,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
