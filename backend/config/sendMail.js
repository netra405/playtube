import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
    },
});

const sendMail = async (to, otp) => {
        await transporter.sendMail({
           from: process.env.USER,
           to: to,
           subject: "Reset Your Password",
           html: `<p>Your OTP for password Reset is <b>${otp}</b>. It expires in 5 minutes.</P>`
        });
   
}

export default sendMail



