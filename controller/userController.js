const User = require('../model/User');
const jwt = require('jsonwebtoken');
const Admin = require('../model/Admin');


const registerUser = async (req, res) => {
    try {
        const { username, userId, password } = req.body;
        const tokenAdmin = req.header('Authorization').split(' ')[1];
        const adminId = jwt.verify(tokenAdmin, process.env.SECRET_KEY).admin_id;

        const admin = await Admin.findById(adminId);

        if (!username || !userId || !password) {
            return res.status(400).json({
                error: 'Mandatory fields are missing',
            });
        }

        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            return res.status(409).json({
                error: 'User already exists',
            });
        }

        const currentUsers = await User.find({ adminId: adminId });

        if (admin.maxUsers == currentUsers.length) {
            return res.status(409).json({
                error: 'Max users limit reached',
            });
        }

        const user = await User.create({ ...req.body, adminId });

        user.password = undefined;


        const token = jwt.sign(
            {
                user_id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '30d'
            }
        )

        user.token = token

        return res.status(201).json(user)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


const loginUser = async (req, res) => {

    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                status: 'User name or Password missing'
            })
        }

        const user = await User.findOne({ username: username })

        if (user && user.password === password) {
            const token = jwt.sign(
                {
                    user_id: user._id
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '2h'
                }
            )
            user.token = token
            user.password = undefined


            return res.status(200).json(user)
        }
        return res.status(400).json({
            status: 'User Id or token is incorrect'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }

}

const getUser = async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


const updateUser = async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        const update = {
            $set: req.body
        };

        await User.updateOne({ username }, update)

        res.status(200).json('User updated successfully')
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


const getAllUsers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const admin_id = jwt.decode(token).admin_id

        const admin = Admin.findById(admin_id)

        if (!admin) {
            return res.status(404).json({
                error: 'Admin not found',
            });
        }

        const users = await User.find({ adminId: admin_id })


        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}

const getUserPermissions = async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        const permissions = user.permissions
        return res.status(200).json(permissions)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: 'An error occurred while processing the request',
        })
    }
}

module.exports = { registerUser, loginUser, getAllUsers, getUser, updateUser, getUserPermissions }