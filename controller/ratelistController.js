const RateList = require('../model/RateList')
const jwt = require('jsonwebtoken')

const addRateList = async (req, res) => {
    try {
        const { rateChartName, level, fat, snf } = req.body

        if(!rateChartName || !level || !fat || !snf){
            res.status(400).json({
                error: 'Please provide all the details'
            })
        }

        const token = req.headers.authorization.split(' ')[1]
        const user_id = jwt.decode(token).user_id

        const rateList = await RateList.create({ ...req.body, userId: user_id })

        res.status(201).json(rateList)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


const getAllRateList = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user_id = jwt.decode(token).user_id

        const rateList = await RateList.find({ userId: user_id })

        res.status(200).json(rateList)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}

module.exports= { addRateList, getAllRateList }