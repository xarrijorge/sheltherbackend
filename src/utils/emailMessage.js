import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // Your email service configuration
});

export const sendEmailOTP = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your OTP for registration',
        text: `Your OTP is: ${otp}`
    });
};