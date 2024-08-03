import bcrypt from 'bcrypt';
import { InitialUser, CompleteUser } from '../models/User.js';

// Function to check if profile is complete
function profileComplete(user) {
    return user.name && user.phone && user.address && user.photo && user.contacts.length === 5 && user.places.length === 5;
}

// Register a new user
export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if email already exists
        const existingEmail = await InitialUser.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const initialUser = new InitialUser({
            email,
            password: hashedPassword
        });

        await initialUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'User registration failed' });
    }
};

// Complete user profile
export const completeUserProfile = async (req, res) => {
    const { email, name, phone, photo, address, contacts, locations, places } = req.body;

    // Validate input
    if (!email || !name || !phone || !photo || !address || !contacts || contacts.length < 1 || !places || places.length < 2) {
        return res.status(400).json({ error: 'Missing or insufficient required fields' });
    }

    try {

        // Find the initial user
        const initialUser = await InitialUser.findOne({ email });
        if (!initialUser) {
            return res.status(400).json({ error: 'Initial registration not found' });
        }

        // Create complete user with data from initial user and additional data
        const completeUser = new CompleteUser({
            _id: initialUser._id, // Copy the id from initial user
            email: initialUser.email,
            password: initialUser.password,
            name,
            phone,
            photo,
            address,
            contacts,
            locations,
            places,
        });

        completeUser.profileComplete = profileComplete(completeUser);

        // Delete initial user
        await InitialUser.deleteOne({ email });
        await completeUser.save();


        const adj = completeUser.profileComplete ? 'completed' : 'updated';

        res.status(200).json({ message: `User profile ${adj} successfully`, user: completeUser });
    } catch (error) {
        res.status(400).json({ error: 'User profile completion failed' });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Find the user in complete users
        let user = await CompleteUser.findOne({ email });

        // If not found in complete users, check initial users
        if (!user) {
            user = await InitialUser.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
};

// Additional controller functions (e.g., update, delete) can be added here