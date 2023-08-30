const nodemailer = require("nodemailer");

const sendEmail = async (email, url) => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: '"RESET PASSWORD" <testuddeepta@gmail.com>',
            to: email,
            subject: "Link to reset password",
            text: "",
            html: url,
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail;