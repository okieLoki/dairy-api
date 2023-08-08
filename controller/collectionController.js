const Collection = require('../model/Collection')
const Farmer = require('../model/Farmer');
const Ledger = require('../model/Ledger');
const User = require('../model/User')
const jwt = require('jsonwebtoken')

const addCollectionByUser = async (req, res) => {
    try {
        const { farmerId, collectionDate, qty, fat, snf, rate, amount } = req.body;

        const username = req.params.username;

        if (!farmerId || !collectionDate || !qty || !fat || !snf || !rate || !amount) {
            return res.status(400).json({
                message: 'Please provide all the details',
            });
        }

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

        const collectionHour = new Date(collectionDate).getHours();
        const shift = collectionHour < 12 ? 'Morning' : 'Evening';

        await Collection.create({
            farmerId,
            farmerName: farmer.farmerName,
            qty,
            fat,
            snf,
            rate,
            amount,
            userId: user._id,
            collectionDate,
            shift,
        });

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
            amount
        })

        farmer.credit += Number(amount);
        await farmer.save();

        return res.status(201).json('Collection added successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};


const addCollectionByAdmin = async (req, res) => {
    try {
        const { username } = req.params;
        const { farmerId, collectionDate, qty, fat, snf, rate, amount } = req.body;

        if (!username || !farmerId || !collectionDate || !qty || !fat || !snf || !rate || !amount) {
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

        const collectionHour = new Date(collectionDate).getHours();
        const shift = collectionHour < 12 ? 'Morning' : 'Evening';

        await Collection.create({
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
            amount
        })

        farmer.credit += Number(amount);
        await farmer.save();

        return res.status(201).json('Collection added successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};


const getAllCollectionsForDate = async (req, res) => {
    try {
        const { username } = req.params;
        const { date } = req.query;
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
                        ]
                    }
                }
            ]
        }).sort({ collectionDate: 1 });
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

        let averageFat;

        const users = await User.find({ adminId: admin_id });
        const userIds = users.map((user) => user._id);

        // Fetch average Fat for all users under the admin
        averageFat = await Collection.aggregate([
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
                    averageFat: {
                        $avg: '$fat',
                    },
                },
            },
        ]);
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

        let totalMilk;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        averageFat = await Collection.aggregate([
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
                    averageFat: {
                        $avg: '$fat',
                    },
                },
            },
        ]);
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

        let averageSNF;

        const users = await User.find({ adminId: admin_id });
        const userIds = users.map((user) => user._id);

        // Fetch average SNF for all users under the admin
        averageSNF = await Collection.aggregate([
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
                    averageSNF: {
                        $avg: '$snf',
                    },
                },
            },
        ]);
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

        let totalMilk;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        averageSNF = await Collection.aggregate([
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
                    averageSNF: {
                        $avg: '$snf',
                    },
                },
            },
        ]);
        res.status(200).json(averageSNF);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};


module.exports = { addCollectionByUser, addCollectionByAdmin, getAllCollectionsForDate, getTotalMilkByAdmin, getTotalMilkByUser, getAverageFatByAdmin, getAverageFatByUser, getAverageSNFByAdmin, getAverageSNFByUser }
