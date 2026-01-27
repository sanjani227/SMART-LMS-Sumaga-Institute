export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const logOTP = (email, otp) => {
    console.log('=================================================');
    console.log(`🔐 OTP Generated for ${email}: ${otp}`);
    console.log('=================================================');
    return true;
};
