
import otpGenerator from 'otp-generator';

export const generateOTP = () => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000).toLocaleString(); // OTP valid for 10 minutes in local timezone

    return { otp, otpExpires };

}