const nodemailer = require("nodemailer");
const htmlContent = require('./emailTemplate')

const sendEmail = async (user, url) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: '"Password Reset" <testuddeepta@gmail.com>',
            to: user.email,
            subject: "Password Reset Request",
            html: htmlContent(user, url)
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail;
1