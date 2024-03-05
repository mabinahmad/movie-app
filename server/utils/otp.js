const nodemailer = require("nodemailer");

// Generate OTP
//===================================================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//Function for sending OTP
//===================================================
const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,

    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send test email
  const info = {
    from: `Netfilm <${process.env.EMAIL_SENDER}>`,
    to: email,
    subject: "Forgot Password OTP",
    text: `Your OTP for resetting password is: ${otp}`,
    // html:'Your OTP for resetting password is: ${otp}'
  };
  const result = await transporter.sendMail(info);
  return otp;
};

module.exports = {
  sendEmailOTP,
  generateOTP,
};
