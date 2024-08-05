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
        email: { type: String }
    }],
    locations: [{
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date, required: true }
    }],
    places: [{
        name: { type: String },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.methods.profileComplete = function () {
    const requiredFields = ['name', 'photo', 'address'];
    const totalFields = requiredFields.length + 2; // +2 for contacts and places
    let completedFields = 0;

    requiredFields.forEach(field => {
        if (this[field] != null && this[field] !== '') completedFields++;
    });

    if (Array.isArray(this.contacts) && this.contacts.length >= 5) completedFields++;
    if (Array.isArray(this.places) && this.places.length >= 5) completedFields++;

    return (completedFields / totalFields) * 100;
};

userSchema.virtual('profileCompletion').get(function () {
    return this.profileComplete();
});

// set profile completion to visible
userSchema.set('toJSON', { virtuals: true });

export const InitialUser = mongoose.model('InitialUser', initialUserSchema);
export const User = mongoose.model('user', userSchema);