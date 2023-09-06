const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken')
const validator = require('email-validator');
const Bill = require('../model/Bill');
const sendEmail = require('../service/emailService')

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
                expiryDate: expiryDate
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

const sendForgotPasswordMail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            error: 'Email missing',
        });
    }

    try {
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'User not found',
            });
        }

        // Generate a unique reset password token
        const token = jwt.sign(
            {
                admin_id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '30m',
            }
        );

        user.resetPasswordToken = token;
        user.resetPasswordTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

        await user.save();

        const resetPasswordURL = `${process.env.BASE_URL}/api/admin/reset-password/${token}`;

        await sendEmail(user, resetPasswordURL);

        return res.status(200).json({
            message: 'Email sent successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};

const renderForgotPasswordPage = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            status: 'Missing Token',
        });
    }

    try {
        const user = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() }, 
        });

        if (!user) {
            return res.status(500).render('errorPage')
        }

        res.render('forgotPassword', {
            title: 'Forgot Password Page',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('errorPage')
    }
};

const changePassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token) {
        return res.status(400).json({
            status: 'Missing Token',
        });
    }

    try {
        const user = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() }, 
        });

        if (!user) {
            return res.status(400).json({
                status: 'Invalid or expired token',
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;

        await user.save();

        return res.status(200).json({
            status: 'Password Changed',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while processing the request',
        });
    }
};

module.exports = {
    register,
    login,
    sendForgotPasswordMail,
    changePassword,
    renderForgotPasswordPage,
};