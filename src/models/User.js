import { Schema, model } from 'mongoose';

// Initial user schema for registration
const initialUserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    whatsapp: { type: String, required: true, unique: true }
}, { timestamps: true });


// Complete user schema
const completeUserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    photo: { type: String, required: true },
    address: { type: String, required: true },
    contacts: {
        type: [{
            id: { type: String, required: true },
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true }
        }],
        validate: [arrayMinLength(1), 'Contacts must have at least 1 items']
    },
    locations: [{
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date }
    }, { default: [] }],
    places: {
        type: [{
            id: { type: String, required: true },
            name: { type: String, required: true },
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        }],
        validate: [arrayMinLength(2), 'Places must have at least 1 items']
    },
    profileComplete: { type: Boolean, default: false }
}, { timestamps: true });



// Custom validator function
function arrayMinLength(minLength) {
    return function (val) {
        return val.length >= minLength;
    };
}


const InitialUser = model('InitialUser', initialUserSchema);
const CompleteUser = model('CompleteUser', completeUserSchema);

export { InitialUser, CompleteUser };