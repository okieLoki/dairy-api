const Farmer = require('../model/Farmer')
const jwt = require('jsonwebtoken')

// @desc    Add a new farmer
// @route   POST /api/farmer
// @access  Private
const addFarmer = async (req, res) => {
    try {

        const { farmerId, rfid, mobileNumber, farmerName, farmerLevel, paymentMode, bankName, accountNumber, bankHolderName } = req.body

        if (!farmerId || !mobileNumber || !farmerName || !farmerLevel || !paymentMode) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            })
        }

        const existingFarmer = await Farmer.findOne({ farmerId })

        if (existingFarmer) {
            return res.status(400).json({
                status: 'Farmer Already Exists'
            })
        }

        const token = req.headers.authorization.split(' ')[1]
        const user_id = jwt.decode(token).user_id

        const farmer = await Farmer.create({ ...req.body, userId: user_id })

        return res.status(201).json(farmer)

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'An error occurred while processing the request',
        })
    }
}

// @desc    Delete a new farmer
// @route   DELETE /api/farmer
// @access  Private
const deleteFarmer = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user_id = jwt.decode(token).user_id

        const farmer = await Farmer.deleteOne({ userId: user_id, farmerId: req.params.id })

        if (!farmer) {
            return res.status(400).json({
                status: 'Farmer does not exist'
            })
        }

        res.status(200).json({
            status: 'Farmer deleted successfully'
        })
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'An error occurred while processing the request',
        })
    }
}

// @desc    Get all farmers
// @route   GET /api/farmer
// @access  Private
const getAllFarmers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user_id = jwt.decode(token).user_id

        const farmer = await Farmer.find({ userId: user_id })

        res.status(200).json(farmer)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}

module.exports = { addFarmer, deleteFarmer, getAllFarmers }