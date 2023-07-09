const User = require('../model/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                error: 'Mandatory fields are missing',
            });
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({
                error: 'User already exists',
            });
        }

        const hashedPasword = await bcrypt.hash(password, 10)

        const user = await User.create({ ...req.body, 'password': hashedPasword });

        const token = jwt.sign(
            {
                user_id: user._id,
                email: user.email
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

const login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({
                status: 'Email or Password missing'
            })
        }

        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {
                    user_id: user._id,
                    email: user.email
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '2h'
                }
            )
            user.token = token
            user.password = undefined

            res.status(200).json(user)
        }
        res.status(400).json({
            status: 'Email or status is incorrect'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }

}

module.exports = { register, login }