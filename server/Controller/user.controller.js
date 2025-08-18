import User from "../Model/user.model.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../Utils/ErrorHandler.js";

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
};

//register user
export const userRegister = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    try {
        // Check if user already exists by email or username
        let existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return next(new ErrorHandler("User already exists with this email or username", 400));
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        next(error);
    }
}

//login user
export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Email and password are required", 400));
    }

    try {
        // Find user by email and include password for comparison
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Compare password using the comparePassword method from the model
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Create JWT token
        const payload = {
            id: user._id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20h" });
        
        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            admin: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

//logout session
export const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", cookieOptions);
        res.status(200).json({
            success: true,
            message: "User is logout successfully"
        });
    } catch (error) {
        next(error);
    }
}
