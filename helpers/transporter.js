const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // host:"smtp.gmail.com",
    // port: 587,
    // secure: true

    service:"gmail",
    auth: {
        user:process.env.SMTP_USER,
        pass:"kyqkfrtnmmvyobrg",
    },
    tls:{
        rejectUnauthorized: false,
    },
});

module.exports = transporter;