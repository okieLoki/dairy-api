const createError = require('http-errors')
const handleErrors = require('../utils/handleErrors')
const { sendOTP, generateOTP } = require('../service/otpService')
const jwt = require('jsonwebtoken')
const Farmer = require('../model/Farmer')
const Collection = require('../model/Collection')
const Ledger = require('../model/Ledger')

// Controller functions for farmer app
const reqOTPFarmer = async (req, res) => {
    try {
        const { mobileNumber } = req.body

        if (!mobileNumber) {
            throw createError.BadRequest('Mobile number is missing')
        }

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
                mobile_number: farmer.mobileNumber,
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
                mobile_number: farmer.mobileNumber,
            },
                process.env.SECRET_KEY,
                {
                    expiresIn: '20h'
                });

            return res.status(200).json({
                message: 'OTP verified successfully',
                token: token,
                farmer: {
                    farmer_id: farmer._id,
                    mobile_number: farmer.mobileNumber,
                }
            });
        } else {
            throw createError.InternalServerError('Internal Server Error');
        }
    } catch (error) {
        handleErrors(error, res);
    }
};

const listProfiles = async (req, res) => {
    try {

        const farmer = req.farmer

        if (!farmer) throw createError.NotFound('Farmer not found')

        if (!farmer.verified) throw createError.BadRequest('Farmer not verified')

        const farmersWithMobile = await Farmer.find({ mobileNumber: farmer.mobileNumber })
            .populate('userId')

        return res.status(200).json({
            message: 'Farmer fetched successfully',
            farmersWithMobile
        });


    } catch (error) {
        handleErrors(error, res);
    }
}

const selectProfile = async (req, res) => {
    try {

        const farmer_id = req.params.id

        if (!farmer_id) throw createError.BadRequest('Farmer Id is missing')

        const farmer = await Farmer.findById(farmer_id).populate('userId')

        if (!farmer) throw createError.NotFound('Farmer not found')

        if (!farmer.verified) throw createError.BadRequest('Farmer not verified')

        const token = jwt.sign({
            farmer_name: farmer.name,
            farmer_id: farmer._id
        },
            process.env.SECRET_KEY,
            {
                expiresIn: '20h'
            });

        return res.status(200).json({
            message: 'Farmer fetched successfully',
            token: token,
            farmer: {
                farmer_name: farmer.farmerName,
                mobile_number: farmer.mobileNumber,
                farmerId: farmer.farmerId,
                farmerLevel: farmer.farmerLevel,
                admin: {
                    admin_username: farmer.userId.username,
                    admin_mobile_number: farmer.userId.mobileNo,
                    admin_contact_person: farmer.userId.contactPerson,
                }
            }
        });

    } catch (error) {

        handleErrors(error, res);

    }
}


const getFarmerCollections = async (req, res) => {
    try {
        const farmer_id = req.farmer._id;
        const farmer = await Farmer.findById(farmer_id);

        if (!farmer.verified) {
            throw createError.BadRequest('Farmer not verified');
        }

        let fromDate, toDate;

        const period = req.query.period;

        if (!period) {
            throw createError.BadRequest('Period should be passed as a query parameter');
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        switch (period) {
            case 'all':
                fromDate = new Date(0);
                toDate = new Date();
                break;
            case 'daily':
                fromDate = new Date(today);
                toDate = new Date(today);
                toDate.setDate(toDate.getDate() + 1);
                break;
            case 'weekly':
                fromDate = new Date(today);
                fromDate.setDate(fromDate.getDate() - 6);
                toDate = new Date(today);
                toDate.setUTCHours(23, 59, 59, 999);
                break;
            case 'monthly':
                fromDate = new Date(today);
                fromDate.setDate(1);
                toDate = new Date(today);
                toDate.setUTCMonth(toDate.getUTCMonth() + 1);
                break;
            default:
                throw createError.BadRequest('Invalid period');
        }

        const collections = await Collection.find({
            farmerId: farmer.farmerId,
            userId: farmer.userId,
            collectionDate: { $gte: fromDate, $lte: toDate }
        });

        return res.status(200).json({
            message: 'Collections fetched successfully',
            collections
        });
    } catch (error) {
        handleErrors(error, res);
    }
};



const getFarmerLedger = async (req, res) => {
    try {
        const farmer_id = req.farmer._id;
        const farmer = await Farmer.findById(farmer_id);

        if (!farmer.verified) {
            throw createError.BadRequest('Farmer Not Verified');
        }

        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            throw createError.BadRequest('Both startDate and endDate query parameters are required');
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (startDateObj >= endDateObj) {
            throw createError.BadRequest('startDate should be earlier than endDate');
        }
        const ledger = await Ledger.find({
            farmerId: farmer.farmerId,
            userId: farmer.userId,
            date: { $gte: startDateObj, $lte: endDateObj }
        });
        if (ledger.length === 0) {
            throw createError.NotFound('No Ledger Found for the specified date range');
        }

        const balance = ledger.reduce((prev, curr) => {
            return prev + curr.credit - curr.debit;
        }, 0);

        return res.status(200).json({
            message: 'Ledger fetched successfully',
            ledger,
            balance
        });
    } catch (error) {
        handleErrors(error, res);
    }
};

module.exports = {
    reqOTPFarmer,
    verifyOTPandLogin,
    listProfiles,
    selectProfile,
    getFarmerCollections,
    getFarmerLedger
}