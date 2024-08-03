import mongoose from 'mongoose';

const initialUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    whatsapp: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date }
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    whatsapp: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    photo: { type: String, required: true },
    address: { type: String, required: true },
    contacts: [{
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    }],
    locations: [{
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date, required: true }
    }],
    places: [{
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    }],
    profileComplete: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

export const InitialUser = mongoose.model('InitialUser', initialUserSchema);
export const User = mongoose.model('user', userSchema);