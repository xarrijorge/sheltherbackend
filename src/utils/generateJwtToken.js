import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    try {
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error generating tokens:', error.message);
        throw new Error('Token generation failed');
    }
};