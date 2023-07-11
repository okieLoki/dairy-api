const Collection = require('../model/Collection')
const Farmer = require('../model/Farmer')
const RateList = require('../model/RateList')
const jwt = require('jsonwebtoken')

const ratioToDecimal = (ratio) => {
    const [numerator, denominator] = ratio.split(':')
    return +numerator / +denominator
}

const addCollection = async (req, res) => {
    try {
        const { farmerId, rateChartName, qty, fat, snf } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const user_id = jwt.decode(token).user_id;

        const farmer = await Farmer.findOne({ farmerId });

        if (!farmer || !rateChartName) {
            return res.status(400).json({
                status: 'Invalid Farmer ID or Rate Chart Name',
            });
        }

        let rate, amount
        const rateList = await RateList.findOne({ rateChartName });

        if (!rateList) {
            return res.status(400).json({
                status: 'No rate list found with this name',
            });
        }

        switch (rateList.category) {
            case 'KGFAT + KGSNF':
                const ratio = ratioToDecimal(rateList.ratio)
                rate = (fat * ratio) + rateList.stdFat
                amount = rate * qty
                break;
            case 'KG FAT ONLY':
                rate = rateList.fatPrice * fat
                amount = rate * qty
                break;
            case 'FAT ONLY':
                rate = rateList.minFat + (fat - rateList.minFat) / rateList.fatIncrement
                amount = rate * qty
                break;
            case 'FAT + SNF':
                rate = rateList.minFat + (fat - rateList.minFat) / rateList.fatIncrement
                snfPrice = rateList.snfPrice
                amount = rate * qty + 0.36 * (snf - rateList.minSnf) / rateList.snfIncrement
                break;
            default:
                return res.status(400).json({
                    status: 'Invalid Rate Chart Category',
                });
        }
        const collection = await Collection.create({
            ...req.body,
            rate: rate,
            amount: amount,
            userId: user_id,
        });

        res.status(201).json(collection);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};


const getAllCollections = async (req, res) => {

}

module.exports = { addCollection, getAllCollections }
