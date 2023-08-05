const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken')
const validator = require('email-validator')

const register = async (req, res) => {
    try {
        const { email, name, password, maxUsers, maxFarmers, expiryDate } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                error: 'Mandatory fields are missing',
            });
        }
        const existingAdmin = await Admin.findOne({ email: email });

        if (existingAdmin) {
            return res.status(409).json({
                error: 'Admin already exists',
            });
        }

        if (validator.validate(email) === false) {
            return res.status(400).json({
                error: 'Invalid email',
            });
        }

        const admin = await Admin.create({ ...req.body });

        const token = jwt.sign(
            {
                admin_id: admin._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '2h'
            }
        )
        admin.password = undefined
        admin.token = token

        const bill = await Bill.create({ adminId: admin._id })

        return res.status(201).json(admin)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
}


const login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email or Password missing'
            })
        }

        const admin = await Admin.findOne({ email })

        if (admin && admin.password === password) {
            const now = new Date();
            const expiryDate = new Date(admin.expiryDate);

            if (expiryDate < now) {
                return res.status(400).json({
                    error: 'Subscription expired'
                });
            }

            const token = jwt.sign(
                {
                    admin_id: admin._id
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: Math.floor((expiryDate - now) / 1000) // Calculate expiresIn in seconds
                }
            );

            admin.token = token;
            admin.password = undefined;

            return res.status(200).json({
                ...admin.toObject(),
            });

        }
        return res.status(400).json({
            status: 'Email or token is incorrect'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }

}

module.exports = { register, login }