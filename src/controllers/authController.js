import bcrypt from 'bcrypt';
import crypto from 'crypto';
import otpGenerator from 'otp-generator';
import { InitialUser, User } from '../models/User.js';

// Assume you have this function implemented
import { sendWhatsAppOTP } from '../utils/whatsappApi.js';
import { sendEmailOTP } from '../utils/emailMessage.js';
import { generateToken } from '../utils/generateJwtToken.js';




// Main Controller functions
// write description for each function


export const registerUser = async (req, res) => {
    const { email, whatsapp, otpMethod = 'whatsapp' } = req.body;

    if (!email || !whatsapp) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const existingData = await InitialUser.findOne({ $or: [{ email }, { whatsapp }] });
        if (existingData) {
            return res.status(400).json({ error: 'Email or whatsapp number already in use' });
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000).toLocaleString(); // OTP valid for 10 minutes in local timezone

        const initialUser = new InitialUser({
            email,
            whatsapp,
            otp,
            otpExpires
        });


        // if (otpMethod === 'email') {
        //     await sendEmailOTP(email, otp);
        // }
        if (otpMethod === 'whatsapp') {
            try {
                const result = await sendWhatsAppOTP(whatsapp, otp);
            } catch (error) {
                return res.status(400).json({ error: 'Failed to send OTP' });
            }
        }

        await initialUser.save();

        res.status(201).json({ message: 'User registered successfully. Please verify OTP.' });
    } catch (error) {
        res.status(400).json({ error: 'User registration failed' });
    }
};
// Tested and works
// Verify OTP
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await InitialUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully. Please complete your profile.' });
    } catch (error) {
        res.status(400).json({ error: 'OTP verification failed' });
    }
};

export const completeUserProfile = async (req, res) => {
    const { email, password, name, photo, address, contacts, locations, places } = req.body;

    if (!email || !password || !name || !photo || !address || !contacts || contacts.length < 1  ) {
        return res.status(400).json({ error: 'Missing or insufficient required fields' });
    }

    try {
        const initialUser = await InitialUser.findOne({ email });
        if (!initialUser) {
            return res.status(400).json({ error: 'Initial registration not found or OTP not verified' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: initialUser.email,
            password: hashedPassword,
            name,
            whatsapp: initialUser.whatsapp,
            photo,
            address,
            contacts,
            locations,
            places,
        });

        const token = generateToken(newUser);
        // attach token to user

        await newUser.save();
        // await InitialUser.deleteOne({ email });


        res.cookie('token', token);
        res.status(200).json({
            message: 'User profile completed successfully',
            token
        });
    } catch (error) {
        res.status(400).json({ error: 'User profile completion failed' });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = generateToken(user);

        // Remove password from user object before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: 'Login successful',
            user: userResponse,
            tokens
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
};


// Helper Controller functions
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const tokens = generateToken(user);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

export const logoutUser = async (req, res) => {

    res.status(200).json({ message: 'Logged out successfully' });
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming you have middleware to extract user from token

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Password change failed' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${process.env.CLIENT_URL}/reset-password/${resetToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to initiate password reset' });
    }
};

// refresh access token (still needs to be completed)
export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }
}