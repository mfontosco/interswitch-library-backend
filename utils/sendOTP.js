const nodemailer = require('nodemailer');

const sendOTP = async (email, OTP) => {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure:true,
        port:465,
        auth: {
            user: 'mstrings11@gmail.com',
            pass: 'tfpx ympu ptbc snwu'
        },
        tls: {
            rejectUnauthorized: false, // Do not verify SSL certificate
          },
    });

    // Email message configuration
    const mailOptions = {
        from: 'mstrings11@gmail.com',
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${OTP}`
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = { sendOTP };
