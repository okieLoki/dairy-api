const Farmer = require('../model/Farmer');
const Ledger = require('../model/Ledger');
const User = require('../model/User');

const getAllDuesByUser = async (req, res) => {
    try {
        const username = req.params.username

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        if (user.permissions.allowDues === 'Not Allow') {
            return res.status(403).send({ message: 'Dues not allowed' })
        }

        const farmers = await Farmer.find({ userId: user._id }).catch((error) => {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while fetching farmers' });
        });

        if (farmers.length === 0) {
            return res.status(404).send({ message: 'No farmer found' })
        }

        const farmerDues = farmers.map((farmer) => {
            return {
                farmerId: farmer.farmerId,
                farmerName: farmer.farmerName,
                dues: farmer.credit - farmer.debit
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

const getAllDuesByAdmin = async (req, res) => {
    try {
        const username = req.params.username

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        const farmers = await Farmer.find({ userId: user._id }).catch((error) => {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while fetching farmers' });
        });

        if (farmers.length === 0) {
            return res.status(404).send({ message: 'No farmer found' })
        }

        const farmerDues = farmers.map((farmer) => {
            return {
                farmerId: farmer.farmerId,
                farmerName: farmer.farmerName,
                dues: (farmer.credit - farmer.debit).toFixed(2)
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

const getPreviousDues = async (req, res) => {
    try {
        const { username, farmerId } = req.params
        const { startDate, endDate } = req.query
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);


        if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const user = await User.findOne({ username })
        const farmer = await Farmer.findOne({ farmerId })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        if (!farmer) {
            return res.status(404).send({ message: 'Farmer not found' })
        }

        // Set the time part of the dates to midnight (00:00:00) to compare just the date part
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedEndDate.setHours(0, 0, 0, 0);

        // Adjust the end date to the start of the next day minus one millisecond
        formattedEndDate.setDate(formattedEndDate.getDate() + 1);
        formattedEndDate.setTime(formattedEndDate.getTime() - 1);

        const ledgerEntries = await Ledger.find({
            $and: [
                {
                    userId: user._id,
                    farmerId: farmer.farmerId
                },
                {
                    $expr: {
                        $and: [
                            { $gte: ['$date', formattedStartDate] },
                            { $lt: ['$date', formattedEndDate] },
                        ],
                    },
                },
            ],
        }).sort({ date: 1 }).limit(1);

        if (ledgerEntries.length === 0) {
            return res.status(200).json(0)
        }

        return res.status(200).json(ledgerEntries[0].previousBalance)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { getAllDuesByUser, getAllDuesByAdmin, getPreviousDues }
