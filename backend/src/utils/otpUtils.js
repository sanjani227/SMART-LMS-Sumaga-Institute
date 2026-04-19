/**
 * ========== OTP UTILITY FUNCTIONS ==========
 * File: backend/src/utils/otpUtils.js
 * Purpose: Generate and log one-time passwords for email verification
 * 
 * @section Functions
 */

/**
 * @function generateOTP
 * @description Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP as string
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @function logOTP
 * @description Log generated OTP to console for debugging
 * @param {string} email - User's email address
 * @param {string} otp - Generated OTP
 * @returns {boolean} Success flag
 */
export const logOTP = (email, otp) => {
    console.log('=================================================');
    console.log(`🔐 OTP Generated for ${email}: ${otp}`);
    console.log('=================================================');
    return true;
};
