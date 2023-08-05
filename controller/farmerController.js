const Farmer = require('../model/Farmer')
const User = require('../model/User')

const addFarmerAsAdmin = async (req, res) => {
    try {
        const { farmerId, mobileNumber, farmerName, farmerLevel, paymentMode, bankName, accountNumber, bankHolderName, fixedRate } = req.body;

        if (!farmerId || !mobileNumber || !farmerName || !farmerLevel || !paymentMode) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        const username = req.params.username;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: 'User does not exist',
            });
        }

        const existingFarmer = await Farmer.findOne({ farmerId, userId: user._id });

        if (existingFarmer) {
            return res.status(409).json({
                message: 'Farmer Already Exists',
            });
        }

        const farmer = await Farmer.create({ ...req.body, userId: user._id });

        return res.status(201).json({
            message: 'Farmer added successfully',
            data: farmer,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'An error occurred while processing the request',
        });
    }
};

const addFarmerAsUser = async (req, res) => {
    try {
        const { farmerId, mobileNumber, farmerName, farmerLevel, paymentMode, bankName, accountNumber, bankHolderName, fixedRate } = req.body;

        if (!farmerId || !mobileNumber || !farmerName || !farmerLevel || !paymentMode) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        const username = req.params.username;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: 'User does not exist',
            });
        }

        if (user.permissions.AddFarmer === 'Not Allow') {
            return res.status(403).json({
                message: 'User does not have permission to add farmer',
            });
        }

        const existingFarmer = await Farmer.findOne({ farmerId, userId: user._id });

        if (existingFarmer) {
            return res.status(409).json({
                message: 'Farmer Already Exists',
            });
        }

        const farmer = await Farmer.create({ ...req.body, userId: user._id });

        return res.status(201).json({
            message: 'Farmer added successfully',
            data: farmer,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'An error occurred while processing the request',
        });
    }
};

const getFarmerById = async (req, res) => {
    try {
        const { farmerId, username } = req.params
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({
                message: 'User does not exist'
            })
        }

        const farmer = await Farmer.findOne({ farmerId, userId: user._id })

        if (!farmer) {
            return res.status(404).json({
                message: 'No farmer found'
            })
        }

        return res.status(200).json(farmer)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'An error occurred while processing the request'
        })
    }
}

const updateFarmerById = async (req, res) => {
    try {
        const { id } = req.params
        const { farmerId, mobileNumber, farmerName, farmerLevel, paymentMode, bankName, accountNumber, bankHolderName, fixedRate } = req.body;

        const farmer = await Farmer.findById(id)

        if (!farmer) {
            return res.status(404).json({
                message: 'Farmer not found'
            })
        }

        farmer.farmerId = farmerId || farmer.farmerId
        farmer.mobileNumber = mobileNumber || farmer.mobileNumber
        farmer.farmerName = farmerName || farmer.farmerName
        farmer.farmerLevel = farmerLevel || farmer.farmerLevel
        farmer.paymentMode = paymentMode || farmer.paymentMode
        farmer.bankName = bankName || farmer.bankName
        farmer.accountNumber = accountNumber || farmer.accountNumber
        farmer.bankHolderName = bankHolderName || farmer.bankHolderName
        farmer.fixedRate = fixedRate || farmer.fixedRate

        await farmer.save()
        return res.status(200).json(farmer)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'An error occurred while processing the request',
        })
    }
}

const deleteFarmer = async (req, res) => {
    try {
        const { username, id } = req.params

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({
                message: 'User does not exist',
            })
        }

        const farmer = await Farmer.findById(id)

        if (!farmer) {
            return res.status(404).json({
                message: 'Farmer does not exist',
            })
        }

        await Farmer.findByIdAndDelete(id)

        return res.status(200).json({
            message: 'Farmer deleted successfully',
        })
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'An error occurred while processing the request',
        })
    }
}

const getAllFarmers = async (req, res) => {
    try {
        const username = req.params.username
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({
                status: 'User does not exist'
            })
        }

        const farmers = await Farmer.find({ userId: user._id })

        res.status(200).json(farmers)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


const getLatestFarmerId = async (req, res) => {
    try {
        const username = req.params.username
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                status: 'User does not exist'
            })
        }

        const recentFarmer = await Farmer.find({ userId: user._id }).sort({ farmerId: -1 }).limit(1)

        res.status(200).json(recentFarmer.length === 0 ? 0 : recentFarmer[0].farmerId)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


module.exports = { addFarmerAsAdmin, addFarmerAsUser, deleteFarmer, getAllFarmers, getFarmerById, updateFarmerById, getLatestFarmerId }