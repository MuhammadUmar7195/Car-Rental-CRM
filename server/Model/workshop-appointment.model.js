import mongoose from "mongoose";

const workAppoint = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email"
        ]
    },
    vehicle: {
        type: String, 
        required: true
    }, 
    service: {
        type: String,
    },
    preferedDate: {
        type: Date,
        required: true
    },
    additionalNotes: {
        type: String,
        default: "Customer wants workshop service"
    }
}, {
    timestamps: true
});

const workshopAppointment = mongoose.model('WorkshopAppointment', workAppoint);

export default workshopAppointment;
