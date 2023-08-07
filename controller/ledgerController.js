const Ledger = require("../model/Ledger");
const User = require("../model/User");

const getAllLedgerEntriesForRangeByAdmin = async (req, res) => {
    try {
        const { username } = req.params;
        const { startDate, endDate } = req.query;
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);

        if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set the time part of the dates to midnight (00:00:00) to compare just the date part
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedEndDate.setHours(0, 0, 0, 0);

        // Adjust the end date to the start of the next day minus one millisecond
        formattedEndDate.setDate(formattedEndDate.getDate() + 1);
        formattedEndDate.setTime(formattedEndDate.getTime() - 1);

        const ledgerEntries = await Ledger.find({
            $and: [
                { userId: user._id },
                {
                    $expr: {
                        $and: [
                            { $gte: ['$date', formattedStartDate] },
                            { $lt: ['$date', formattedEndDate] },
                        ],
                    },
                },
            ],
        }).sort({ date: 1 });

        res.status(200).json(ledgerEntries);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};




const getAllLedgerEntriesForRange = async (req, res) => {
    try {
        const { username } = req.params;
        const { startDate, endDate } = req.query;
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);

        if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Set the time part of the dates to midnight (00:00:00) to compare just the date part
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedEndDate.setHours(0, 0, 0, 0);

        // Adjust the end date to the start of the next day minus one millisecond
        formattedEndDate.setDate(formattedEndDate.getDate() + 1);
        formattedEndDate.setTime(formattedEndDate.getTime() - 1);

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.permissions.allowLedger === 'Not Allow') {
            return res.status(403).json({ message: 'User not allowed to access ledger' });
        }

        const ledgerEntries = await Ledger.find({
            $and: [
                { userId: user._id },
                {
                    $expr: {
                        $and: [
                            { $gte: ['$date', formattedStartDate] },
                            { $lt: ['$date', formattedEndDate] },
                        ],
                    },
                },
            ],
        }).sort({ date: 1 });
        res.status(200).json(ledgerEntries);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};






module.exports = { getAllLedgerEntriesForRange, getAllLedgerEntriesForRangeByAdmin }