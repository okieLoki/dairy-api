const createError = require('http-errors')
const handleErrors = require('../utils/handleErrors')
const { sendOTP, generateOTP } = require('../service/otpService')
const jwt = require('jsonwebtoken')
const Farmer = require('../model/Farmer')

// Controller functions for farmer app
const reqOTPFarmer = async (req, res) => {
    try {
        const { mobileNumber } = req.body

        if (!mobileNumber) throw createError.BadRequest('Mobile number is required')

        const farmer = await Farmer.findOne({ mobileNumber })

        if (!farmer) throw createError.NotFound(`Farmer with mobile number ${mobileNumber} does not exist`)

        const { otp, expiry } = generateOTP()

        farmer.otp = otp
        farmer.otp_expiry = expiry

        const result = await farmer.save()

        if (result) {
            sendOTP(mobileNumber, otp)

            const token = jwt.sign({
                farmer_id: farmer._id,
                farmer_name: farmer.farmerName,
                farmerID: farmer.farmerId,
                mobile_number: farmer.mobileNumber,
                user_id: farmer.userId,
                verified: farmer.verified
            },
                process.env.SECRET_KEY,
                {
                    expiresIn: '20h'
                })

            return res.status(200).json({
                message: 'OTP sent successfully',
                token
            })
        }
        else {
            throw createError.InternalServerError('Internal Server Error')
        }
    }
    catch (error) {
        handleErrors(error, res)
    }
}

const verifyOTPandLogin = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) throw createError.BadRequest('OTP is required');

        const farmer = await Farmer.findById(req.farmer._id);

        if (!farmer) throw createError.NotFound('Farmer not found');

        if (farmer.otp !== otp) throw createError.BadRequest('Invalid OTP');

        if (farmer.otp_expiry < new Date()) throw createError.BadRequest('OTP expired');


        const token = jwt.sign({
            farmer_id: farmer._id,
            farmer_name: farmer.farmerName,
            farmerID: farmer.farmerId,
            mobile_number: farmer.mobileNumber,
            user_id: farmer.userId,
            verified: farmer.verified
        },
            process.env.SECRET_KEY,
            {
                expiresIn: '20h'
            });

        return res.status(200).json({
            message: 'OTP verified successfully',
            token
        });

    } catch (error) {
        handleErrors(error, res);
    }
};


module.exports = {
    reqOTPFarmer,
    verifyOTPandLogin
}