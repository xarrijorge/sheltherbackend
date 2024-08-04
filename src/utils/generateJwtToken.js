import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    try {
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error('Token generation failed');
    }
};