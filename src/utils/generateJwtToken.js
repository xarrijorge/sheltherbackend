import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    try {
        const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error('Token generation failed');
    }
};