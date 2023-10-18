const createError = require('http-errors')
const handleErrors = require('../utils/handleErrors')
const { sendOTP, generateOTP } = require('../service/otpService')
const jwt = require('jsonwebtoken')
const Farmer = require('../model/Farmer')
const Collection = require('../model/Collection')

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

        farmer.verified = true;

        const result = await farmer.save();

        if (result) {

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
        } else {
            throw createError.InternalServerError('Internal Server Error');
        }
    } catch (error) {
        handleErrors(error, res);
    }
};

const getFarmerCollections = async (req, res) => {
    try {

        const farmer_id = req.farmer._id

        // check if verified
        const farmer = await Farmer.findById(farmer_id)
        if (!farmer.verified) throw createError.BadRequest('Farmer not verified')

        const collections = await Collection.find({
            farmerId: farmer.farmerId,
            userId: farmer.userId
        })

        if (!collections) throw createError.NotFound('No collections found')

        return res.status(200).json({
            message: 'Collections fetched successfully',
            collections
        })


    } catch (error) {
        handleErrors(error, res)
    }
}

const getCollectionsDaily = async (req, res) => {
    try {
        const farmer_id = req.farmer._id;
        const farmer = await Farmer.findById(farmer_id);

        if (!farmer.verified) {
            throw createError.BadRequest('Farmer not verified');
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate() + 1);

        const collections = await Collection.find({
            farmerId: farmer.farmerId,
            userId: farmer.userId,
            collectionDate: { $gte: today, $lt: nextDay }
        });

        if (collections.length === 0) {
            throw createError.NotFound('No collections found for today');
        }

        return res.status(200).json({
            message: 'Collections fetched successfully',
            collections
        });
    } catch (error) {
        handleErrors(error, res);
    }
};

const getCollectionsWeekly = async (req, res) => {
    try {
        const farmer_id = req.farmer._id;
        const farmer = await Farmer.findById(farmer_id);

        if (!farmer.verified) {
            throw createError.BadRequest('Farmer not verified');
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999);

        const collections = await Collection.find({
            farmerId: farmer.farmerId,
            userId: farmer.userId,
            collectionDate: { $gte: sevenDaysAgo, $lte: endOfToday }
        });

        if (collections.length === 0) {
            throw createError.NotFound('No collections found for the past 7 days');
        }

        return res.status(200).json({
            message: 'Collections fetched successfully',
            collections
        });
    } catch (error) {
        handleErrors(error, res);
    }
};




const getCollectionsMonthly = async (req, res) => {
    try {
        const farmer_id = req.farmer._id;
        const farmer = await Farmer.findById(farmer_id);

        if (!farmer.verified) {
            throw createError.BadRequest('Farmer not verified');
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        today.setDate(1);

        const nextMonth = new Date(today);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);

        const collections = await Collection.find({
            farmerId: farmer.farmerId,
            userId: farmer.userId,
            collectionDate: { $gte: today, $lt: nextMonth }
        });

        if (collections.length === 0) {
            throw createError.NotFound('No collections found for the current month');
        }

        return res.status(200).json({
            message: 'Collections fetched successfully',
            collections
        });
    } catch (error) {
        handleErrors(error, res);
    }
};


module.exports = {
    reqOTPFarmer,
    verifyOTPandLogin,
    getFarmerCollections,
    getCollectionsDaily,
    getCollectionsWeekly,
    getCollectionsMonthly
}