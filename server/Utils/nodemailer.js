import nodemailer from "nodemailer";
import crypto from "crypto";
import env from "dotenv";
env.config();

export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
}

export const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});