import workshopAppointment from "../Model/workshop-appointment.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";

export const workShopAppointment = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, email, vehicle, service, preferedDate, additionalNotes } = req.body;

        // Validate request data
        if (!fullName || !phoneNumber || !email || !vehicle || !preferedDate) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        // Create a new appointment
        const newAppointment = new workshopAppointment({
            fullName,
            phoneNumber,
            email,
            vehicle,
            service,
            preferedDate,
            additionalNotes
        });

        await newAppointment.save();

        res.status(201).json({
            success: true,
            message: "Workshop appointment created successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const getAllWorkshopAppointments = async (req, res, next) => {
    try {
        const appointments = await workshopAppointment.find();
        res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        next(error);
    }
};
