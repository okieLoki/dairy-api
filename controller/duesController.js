const jwt = require('jsonwebtoken')
const Farmer = require('../model/Farmer')

const getDuesFarmerId = async (req, res) => {
    try {
        const farmerId  = req.params.farmerId
        const token = req.headers.authorization.split(' ')[1];
        const user_id = jwt.decode(token).user_id;

        const farmer = await Farmer.findOne({ userId: user_id, farmerId: farmerId })

        if (!farmer) {
            return res.status(404).send({ message: 'No farmer found' })
        }

        res.status(200).json({
            dues: farmer.dues
        })
    }
    catch (error) {
        console.log(error)

        res.status(400).json({
            status: 'Error'
        })
    }
}

const getAllDues = async (req, res) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const user_id = jwt.decode(token).user_id;

        const farmers = await Farmer.find({ userId: user_id })

        if (!farmers) {
            return res.status(404).send({ message: 'No farmer found' })
        }

        const farmerDues = farmers.map((farmer) => {
            if (farmer.dues > 0) {
                return {
                    farmerId: farmer.farmerId,
                    farmerName: farmer.farmerName,
                    dues: farmer.dues
                }
            }
        })

        res.status(200).json(farmerDues)

    } catch (error) {
        console.log(error)

        res.status(400).json({
            status: 'Error'
        })
    }
}

const settleAllDues = async (req, res) => {
    
        try {
            const token = req.headers.authorization.split(' ')[1];
            const user_id = jwt.decode(token).user_id;
    
            const farmers = await Farmer.find({ userId: user_id })
    
            if (!farmers) {
                return res.status(404).send({ message: 'No farmer found' })
            }
    
            farmers.forEach(async (farmer) => {
                farmer.dues = 0
                await farmer.save()
            })
    
            res.status(200).json({
                status: 'Success'
            })
    
        } catch (error) {
            console.log(error)
    
            res.status(400).json({
                status: 'Error'
            })
        }
}

module.exports = {getAllDues, settleAllDues, getDuesFarmerId}
