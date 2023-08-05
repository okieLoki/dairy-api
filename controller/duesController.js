const Farmer = require('../model/Farmer');
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

module.exports = { getAllDuesByUser, getAllDuesByAdmin }
