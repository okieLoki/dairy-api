const RateList = require('../model/RateList')
const jwt = require('jsonwebtoken')

const addRateList = async (req, res) => {
    try {
        
        const { category, level, rateChartName, animal, stdFat, stdSNF, ratio, stdRate, minFat, maxFat, fatIncrement, minSNF, maxSNF, snfIncrement } = req.body

        if(!category){
            res.status(400).json({
                error: 'Mandatory fields are missing',
            })
        }

        const existingRateList = await RateList.findOne({ rateChartName })

        if(existingRateList){
            res.status(400).json({
                error: 'Rate List Already Exists'
            })
        }

        switch(category){
            case 'KGFAT + KGSNF':
                if(!level || !rateChartName || !animal || !ratio || !stdFat || !stdSNF || !stdRate){
                    res.status(400).json({
                        error: 'Mandatory fields are missing',
                    });
                }
                break
            case 'KG FAT ONLY': 
                if(!level || !rateChartName || !animal || !stdRate){
                    res.status(400).json({
                        error: 'Mandatory fields are missing',
                    });
                }
                break
            case 'FAT ONLY':
                if(!level || !rateChartName || !animal || !minFat || !maxFat || !fatIncrement){
                    res.status(400).json({
                        error: 'Mandatory fields are missing',
                    });
                    if(minFat > maxFat){
                        res.status(400).json({
                            error: 'Minimum FAT should be less than Maximum FAT'
                        })
                    }
                }
                break
            case 'FAT + SNF':
                if(!level || !rateChartName || !animal || !minFat || !maxFat || !fatIncrement || !minSNF || !maxSNF || !snfIncrement){
                    res.status(400).json({
                        error: 'Mandatory fields are missing',
                    });
                }
                if(minFat > maxFat || minSNF > maxSNF){
                    res.status(400).json({
                        error: 'Minimum FAT/SNF should be less than Maximum FAT/SNF'
                    })
                }
                break
            default: 
                res.status(400).json({
                    error: 'Invalid Category',
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