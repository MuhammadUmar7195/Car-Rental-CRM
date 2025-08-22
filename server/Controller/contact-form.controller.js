import ContactForm from "../Model/contact-form.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";

export const createContactForm = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phoneNumber, serviceInterest, message } = req.body;

        if (!firstName || !lastName || !email || !phoneNumber || !serviceInterest || !message) {
            return next(new ErrorHandler("Please provide all fields", 400));
        }

        if(phoneNumber.length < 10 || phoneNumber.length > 15) {
            return next(new ErrorHandler("Please enter a valid phone number", 400));
        }

        const newContact = await ContactForm.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            serviceInterest,
            message
        });

        return res.status(201).json({ message: "Contact created successfully", newContact });
    } catch (error) {
        next(error);
    }
}

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await ContactForm.find();
        if(contacts.length === 0) {
            return next(new ErrorHandler("No contacts found", 404));
        }
        return res.status(200).json({ contacts });
    } catch (error) {
        next(error);
    }
};
