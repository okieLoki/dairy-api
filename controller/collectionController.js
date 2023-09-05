const Collection = require('../model/Collection')
const Farmer = require('../model/Farmer');
const Ledger = require('../model/Ledger');
const User = require('../model/User')
const jwt = require('jsonwebtoken')

const addCollection = async (req, res) => {
    try {
        const { username } = req.params;
        const { farmerId, collectionDate, qty, fat, snf, rate, amount, shift } = req.body;

        if (!username || !farmerId || !collectionDate || !qty || qty === 0 || !rate || rate === 0 || !amount || amount === 0) {
            return res.status(400).json({
                message: 'Please provide all the details',
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({ message: 'No user found' });
        }

        const farmer = await Farmer.findOne({ userId: user._id, farmerId });

        if (!farmer) {
            return res.status(400).json({
                status: 'Invalid Farmer ID or The Farmer does not belong to the User',
            });
        }

        const collection = await Collection.create({
            farmerId,
            farmerName: farmer.farmerName,
            qty,
            fat,
            snf,
            rate,
            amount,
            userId: user._id,
            collectionDate,
            shift
        });

        let previousBalance = Number(farmer.credit) - Number(farmer.debit);

        await Ledger.create({
            farmerId,
            date: collectionDate,
            credit: amount,
            remarks: 'Collection',
            userId: user._id,
            qty,
            shift,
            fat,
            snf,
            amount,
            previousBalance: previousBalance,
            collectionId: collection._id
        })

        farmer.credit = (farmer.credit + Number(amount)).toFixed(2);
        await farmer.save();

        return res.status(201).json('Collection added successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};

const getCollectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const collection = await Collection.findById(id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        return res.status(200).json(collection);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}

const updateCollection = async (req, res) => {
    try {
        const { id, username } = req.params;
        const { farmerId, collectionDate, qty, fat, snf, rate, amount, shift } = req.body;

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).send({ message: 'No user found' });
        }

        const farmer = await Farmer.findOne({ userId: user._id, farmerId });

        if (!farmer) {
            return res.status(400).json({
                status: 'Invalid Farmer ID or The Farmer does not belong to the User',
            });
        }

        const collection = await Collection.findById(id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (amount) {
            farmer.credit = farmer.credit - Number(collection.amount) + Number(amount);
        }

        collection.amount = amount || collection.amount;
        collection.collectionDate = collectionDate || collection.collectionDate;
        collection.fat = fat || collection.fat;
        collection.qty = qty || collection.qty;
        collection.rate = rate || collection.rate;
        collection.snf = snf || collection.snf;
        collection.shift = shift || collection.shift;

        const ledger = await Ledger.findOne({ collectionId: id });

        if (!ledger) {
            return res.status(404).json({ message: 'Ledger not found' });
        }

        ledger.credit = amount || ledger.credit;
        ledger.date = collectionDate || ledger.date;
        ledger.fat = fat || ledger.fat;
        ledger.qty = qty || ledger.qty;
        ledger.snf = snf || ledger.snf;
        ledger.shift = shift || ledger.shift

        await collection.save();
        await ledger.save();
        await farmer.save();

        return res.status(200).json('Collection updated successfully');
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


const getAllCollectionsForDate = async (req, res) => {
    try {
        const { username } = req.params;
        const { date, shift } = req.query;
        const formattedDate = new Date(date);

        if (isNaN(formattedDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const collections = await Collection.find({
            $and: [
                { userId: user._id },
                {
                    $expr: {
                        $and: [
                            { $eq: [{ $dayOfMonth: '$collectionDate' }, { $dayOfMonth: formattedDate }] },
                            { $eq: [{ $month: '$collectionDate' }, { $month: formattedDate }] },
                            { $eq: [{ $year: '$collectionDate' }, { $year: formattedDate }] },
                            { $eq: ['$shift', shift] }, // Match the shift value
                        ]
                    }
                }
            ]
        }).sort({ collectionDate: -1 });
        res.status(200).json(collections);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};

const getTotalMilkByAdmin = async (req, res) => {
    const { start, end } = req.query;

    try {
        const token = req.headers.authorization.split(' ')[1];
        const admin_id = jwt.decode(token).admin_id;

        let totalMilk;

        const users = await User.find({ adminId: admin_id });
        const userIds = users.map((user) => user._id);

        totalMilk = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: { $in: userIds }, // Filter collections by userIds array
                },
            },
            {
                $group: {
                    _id: null,
                    totalMilk: {
                        $sum: '$qty',
                    },
                },
            },
        ]);
        res.status(200).json(totalMilk);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};

const getTotalMilkByUser = async (req, res) => {
    const { start, end } = req.query;

    try {
        const { username } = req.params

        let totalMilk;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        totalMilk = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: user._id, // Filter collections by userIds array
                },
            },
            {
                $group: {
                    _id: null,
                    totalMilk: {
                        $sum: '$qty',
                    },
                },
            },
        ]);
        res.status(200).json(totalMilk);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};


const getAverageFatByAdmin = async (req, res) => {
    const { start, end } = req.query;

    try {
        const token = req.headers.authorization.split(' ')[1];
        const admin_id = jwt.decode(token).admin_id;

        let totalFat, totalMilk, averageFat;

        const users = await User.find({ adminId: admin_id });
        const userIds = users.map((user) => user._id);

        totalMilk = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: { $in: userIds }, // Filter collections by userIds array
                    fat: { $ne: 0 },
                    snf: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalMilk: {
                        $sum: '$qty',
                    },
                },
            },
        ]);

        totalFat = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: { $in: userIds },
                    fat: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalFat: {
                        $sum: { $multiply: ['$qty', '$fat'] }, // Calculate totalFat as qty * fat
                    },
                },
            },
        ]);

        if (totalFat.length === 0 || totalMilk.length === 0) return 0
    
        averageFat = (totalFat[0].totalFat / totalMilk[0].totalMilk).toFixed(2);

        res.status(200).json(averageFat);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};

const getAverageFatByUser = async (req, res) => {
    const { start, end } = req.query;

    try {
        const { username } = req.params

        let averageFat, totalMilk, totalFat;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        totalMilk = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: user._id, // Filter collections by userIds array
                    fat: { $ne: 0 },
                    snf: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalMilk: {
                        $sum: '$qty',
                    },
                },
            },
        ]);

        totalFat = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: user._id,
                    fat: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalFat: {
                        $sum: { $multiply: ['$qty', '$fat'] }, // Calculate totalFat as qty * fat
                    },
                },
            },
        ]);

        if (totalFat.length === 0 || totalMilk.length === 0) return 0

        averageFat = (totalFat[0].totalFat / totalMilk[0].totalMilk).toFixed(2);


        res.status(200).json(averageFat);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};


const getAverageSNFByAdmin = async (req, res) => {
    const { start, end } = req.query;

    try {
        const token = req.headers.authorization.split(' ')[1];
        const admin_id = jwt.decode(token).admin_id;

        let totalMilk, averageSNF, totalSNF;

        const users = await User.find({ adminId: admin_id });
        const userIds = users.map((user) => user._id);

        totalMilk = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: { $in: userIds }, // Filter collections by userIds array
                    fat: { $ne: 0 },
                    snf: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalMilk: {
                        $sum: '$qty',
                    },
                },
            },
        ]);

        totalSNF = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: { $in: userIds },
                    fat: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalSNF: {
                        $sum: { $multiply: ['$qty', '$snf'] }, // Calculate totalFat as qty * fat
                    },
                },
            },
        ]);
        if (totalSNF.length === 0 || totalMilk.length === 0) return 0

        averageSNF = (totalSNF[0].totalSNF / totalMilk[0].totalMilk).toFixed(2);
        res.status(200).json(averageSNF);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};

const getAverageSNFByUser = async (req, res) => {
    const { start, end } = req.query;

    try {
        const { username } = req.params

        let averageSNF, totalMilk, totalSNF;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        totalMilk = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: user._id, // Filter collections by userIds array
                    fat: { $ne: 0 },
                    snf: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalMilk: {
                        $sum: '$qty',
                    },
                },
            },
        ]);

        totalSNF = await Collection.aggregate([
            {
                $match: {
                    collectionDate: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                    userId: user._id,
                    fat: { $ne: 0 }
                },
            },
            {
                $group: {
                    _id: null,
                    totalSNF: {
                        $sum: { $multiply: ['$qty', '$snf'] }, // Calculate totalFat as qty * fat
                    },
                },
            },
        ]);

        if (totalSNF.length === 0 || totalMilk.length === 0) return 0
        averageSNF = (totalSNF[0].totalSNF / totalMilk[0].totalMilk).toFixed(2);

        res.status(200).json(averageSNF);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};


module.exports = { addCollection, getAllCollectionsForDate, getTotalMilkByAdmin, getTotalMilkByUser, getAverageFatByAdmin, getAverageFatByUser, getAverageSNFByAdmin, getAverageSNFByUser, updateCollection, getCollectionById }
