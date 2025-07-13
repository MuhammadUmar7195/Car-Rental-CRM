import RentalOrder from '../Model/rental.model.js';
import Customer from '../Model/customer.model.js';
import Fleet from '../Model/fleet.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';
import { transporter } from "../Utils/nodemailer.js";
import { Buffer } from "buffer";

// Cerate a new rental order
export const createRentalOrder = async (req, res, next) => {
    try {
        const { customerId, fleetId, rentalData } = req.body;

        // Validate required fields based on new schema
        if (!customerId || !fleetId || !rentalData?.rentalDate || !rentalData?.purpose ||
            !rentalData?.setPrice || !rentalData?.bond || !rentalData?.advanceRent) {
            return next(new ErrorHandler('Missing required rental data', 400));
        }

        const customer = await Customer.findById(customerId);
        const fleet = await Fleet.findById(fleetId);

        if (!customer || !fleet) {
            return next(new ErrorHandler('Customer or vehicle not found', 404));
        }

        // Check if vehicle is available for rental
        if (fleet.status === "Rented") {
            return next(new ErrorHandler('Vehicle is not available for rental', 400));
        }

        const remainingAmount = rentalData.setPrice - (rentalData.advanceRent || 0);

        const rentalOrder = new RentalOrder({
            customer: customerId,
            fleet: fleetId,
            bookingDate: new Date(),
            rentalDate: new Date(rentalData.rentalDate),
            purpose: rentalData.purpose,
            setPrice: rentalData.setPrice,
            overdue: rentalData.overdue || 0,
            bond: rentalData.bond,
            advanceRent: rentalData.advanceRent,
            totalBill: rentalData.setPrice,
            amountPaid: rentalData.advanceRent || 0,
            remainingAmount: remainingAmount,
            status: 'reserved',
            paymentStatus: rentalData.advanceRent > 0 ? 'partial' : 'pending'
        });

        await rentalOrder.save();
        fleet.status = "Rented";
        await fleet.save();

        return res.status(201).json({
            success: true,
            message: "Rental order created successfully",
            data: rentalOrder
        });
    } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return next(new ErrorHandler("Duplicate rental order: This vehicle already has a reserved rental.", 409));
        }
        next(error);
    }
}

// send rental invoice via email
export const sendRentalInvoice = async (req, res, next) => {
    try {
        const { email, pdfBase64 } = req.body;

        if (!email || !pdfBase64) {
            return next(new ErrorHandler("Missing email or PDF data", 400));
        }

        const buffer = Buffer.from(pdfBase64, "base64");

        const mailOptions = {
            from: `"Rental Service" ${email}`,
            to: email,
            subject: "Your Rental Invoice",
            text: "Please find attached your rental invoice.",
            attachments: [
                {
                    filename: "RentalInvoice.pdf",
                    content: buffer,
                    contentType: "application/pdf",
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Invoice sent to email" });
    } catch (err) {
        console.error("Email send failed:", err);
        return next(new ErrorHandler("Failed to send email", 500));
    }
};

// Get all rental orders
export const getAllRentals = async (req, res, next) => {
    try {
        const rentals = await RentalOrder.find()
            .populate("customer")
            .populate("fleet");
        res.status(200).json({ success: true, rentals });
    } catch (error) {
        next(error);
    }
};

// Get single rental order by ID
export const getSingleRental = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rental = await RentalOrder.findById(id)
            .populate("customer")
            .populate("fleet");
        if (!rental) {
            return next(new ErrorHandler("Rental order not found", 404));
        }
        res.status(200).json({ success: true, rental });
    } catch (error) {
        next(error);
    }
};
//Delete the rental order
export const deleteRental = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rental = await RentalOrder.findById(id)
            .populate("customer")
            .populate("fleet");
        if (!rental) {
            return next(new ErrorHandler("Rental order not found", 404));
        }
        // Missing: Actually deleting the rental order!
        await RentalOrder.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Rental order deleted successfully" });
    } catch (error) {
        next(error);
    }
};