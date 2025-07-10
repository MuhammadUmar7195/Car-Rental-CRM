import jwt from "jsonwebtoken";
import Admin from "../Model/admin.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { transporter, generateOTP } from "../Utils/nodemailer.js";

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
};

//register admin
export const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    try {
        // Check if admin already exists by email or username
        let existingAdmin = await Admin.findOne({
            $or: [{ email }, { username }]
        });

        if (existingAdmin) {
            return next(new ErrorHandler("Admin already exists with this email or username", 400));
        }

        // Check if the maximum number of admins (2)
        const adminCount = await Admin.countDocuments();
        if (adminCount >= 2) {
            return next(new ErrorHandler("Maximum of 2 admins allowed", 400));
        }

        const admin = new Admin({ username, email, password });
        await admin.save();

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            }
        });
    } catch (error) {
        next(error);
    }
}

//login admin
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Email and password are required", 400));
    }

    try {
        // Find admin by email and include password for comparison
        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Compare password using the comparePassword method from the model
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Create JWT token
        const payload = {
            id: admin._id,
            role: admin.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20h" });

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 20 * 60 * 60 * 1000, // 20 hours
        });

        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

//logut session
export const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", cookieOptions);
        res.status(200).json({
            success: true,
            message: "Admin logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

//Forgot Password logic here 

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new ErrorHandler("Email is required", 400));
        }

        const user = await Admin.findOne({ email });
        if (!user) {
            return next(new ErrorHandler("User not found with this email", 400));
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Password Reset Request</h2>
                    <p>You requested to reset your password. Here is your OTP 😊</p>
                    <p>This OTP is valid for 15 minutes.</p>
                    <h3 style="background: #f3f4f6; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h3>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        //To save otp or expiry time in schema
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (error) {
        next(error);
    }
}

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return next(new ErrorHandler("Email and OTP are required", 400));
        }

        const user = await Admin.findOne({ email });
        if (!user) {
            return next(new ErrorHandler("User not found with this email", 404));
        }

        // Check OTP and expiry
        if (
            !user.otp ||
            !user.otpExpiry ||
            user.otp !== otp ||
            user.otpExpiry < Date.now()
        ) {
            return next(new ErrorHandler("Invalid or expired OTP", 400));
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return next(new ErrorHandler("Email, new password, and confirm password are required", 400));
        }

        if (newPassword !== confirmPassword) {
            return next(new ErrorHandler("Passwords do not match", 400));
        }

        const user = await Admin.findOne({ email });
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Only allow reset if OTP is verified (both fields null)
        if (user.otp !== null || user.otpExpiry !== null) {
            return next(new ErrorHandler("OTP verification required before resetting password", 400));
        }

        user.password = newPassword; // Let pre-save hook hash it
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        next(error);
    }
}
