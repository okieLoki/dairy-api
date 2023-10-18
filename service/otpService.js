const axios = require('axios');

const generateOTP = () => {
    
    const otp = Math.floor(1000 + Math.random() * 9000);
    let expiry = new Date();

    expiry.setTime(new Date().getTime() + (5 * 60 * 1000));

    console.log(otp, expiry)

    return {
        otp,
        expiry
    }
}

const sendOTP = async (mobileNumber, otp) => {
    console.log('Sending OTP')
    return true
}

module.exports = {
    generateOTP,
    sendOTP
}