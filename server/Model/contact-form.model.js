import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email"
        ]
    },
    phoneNumber: {
        type: String,
        required: true
    },
    serviceInterest: {
        type: String,
        required: true
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
}, {
    timestamps: true
});

const ContactForm = mongoose.model("ContactForm", contactFormSchema);

export default ContactForm;
