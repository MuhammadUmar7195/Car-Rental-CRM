import mongoose from "mongoose";
import argon from "argon2";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    role: {
        type: String,
        enum: ["customer"],
        default: "customer",
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await argon.hash(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (userPassword) {
    return await argon.verify(this.password, userPassword);
};


const User = mongoose.model("User", userSchema);

export default User;