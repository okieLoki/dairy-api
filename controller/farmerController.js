const Farmer = require('../model/Farmer')
const jwt = require('jsonwebtoken')

const addFarmer = async (req, res) => {
    try {
        
        const{farmerId, rfid, mobileNumber, farmerName, farmerLevel, paymentMode, bankName, accountNumber, bankHolderName} = req.body

        if(!farmerId|| !mobileNumber || !farmerName || !farmerLevel || !paymentMode){
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            })
        }

        const existingFarmer = await Farmer.findOne({farmerId})

        if(existingFarmer){
            res.status(400).json({
                status: 'Farmer Already Exists'
            })
        }

        const token = req.headers.authorization.split(' ')[1]
        const user_id = jwt.decode(token).user_id

        const farmer = await Farmer.create({ ...req.body, userId: user_id })

        res.status(201).json(farmer)

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'An error occurred while processing the request',
        })
    }
}

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

module.exports = {addFarmer, getAllFarmers}