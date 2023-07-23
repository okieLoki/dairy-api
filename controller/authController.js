const User = require('../model/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Admin

const register = async (req, res) => {
    try {
        const { phoneNo, name, password } = req.body;

        if (!phoneNo || !name || !password) {
            return res.status(400).json({
                error: 'Mandatory fields are missing',
            });
        }
        const existingUser = await User.findOne({ phoneNo: phoneNo });

        if (existingUser) {
            res.status(409).json({
                error: 'User already exists',
            });
        }

        if (phoneNo.toString().length !== 10) {
            res.status(400).json({
                error: 'Phone Number should be of 10 digits',
            });
        }

        const hashedPasword = await bcrypt.hash(password, 10)

        const user = await User.create({ ...req.body, 'password': hashedPasword });

        const token = jwt.sign(
            {
                user_id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '2h'
            }
        )
        user.password = undefined
        user.token = token

        res.status(201).json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public

const login = async (req, res) => {

    try {
        const { phoneNo, password } = req.body

        if (!phoneNo || !password) {
            return res.status(400).json({
                status: 'Phone Number or Password missing'
            })
        }

        const user = await User.findOne({ phoneNo })

        if (user && (await bcrypt.compare(password, user.password))) {
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
            status: 'Phone Number or token is incorrect'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }

}

module.exports = { register, login }