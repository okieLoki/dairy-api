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
  
    const url = 'https://sms.aakashsms.com/sms/v3/send';
    const text = `Your OTP for Hamroo Farmer Login is ${otp}`
    const token = process.env.SMS_TOKEN;

    const formData = new URLSearchParams();
    formData.append('auth_token', token);
    formData.append('to', mobileNumber);
    formData.append('text', text);

    await axios.post(url, formData)
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

module.exports = {
    generateOTP,
    sendOTP
}