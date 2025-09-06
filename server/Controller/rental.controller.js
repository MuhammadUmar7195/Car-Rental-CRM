import RentalOrder from '../Model/rental.model.js';
import Customer from '../Model/customer.model.js';
import Fleet from '../Model/fleet.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';
import { transporter } from "../Utils/nodemailer.js";
import { Buffer } from "buffer";

// Create a new rental order
export const createRentalOrder = async (req, res, next) => {
  try {
    const { customerId, fleetId, bookingDate, rentalData } = req.body;

    if (!customerId || !fleetId || !rentalData?.purpose ||
        !rentalData?.setPrice || !rentalData?.bond || !rentalData?.advanceRent) {
      return next(new ErrorHandler('Missing required rental data', 400));
    }

    const customer = await Customer.findById(customerId);
    const fleet = await Fleet.findById(fleetId);

    if (!customer || !fleet) {
      return next(new ErrorHandler('Customer or vehicle not found', 404));
    }

    if (fleet.status === "Rented") {
      return next(new ErrorHandler('Vehicle is not available for rental', 400));
    }

    // Return date logic
    let returnDate;
    let rentalPeriodSuggestion = null;
    if (!rentalData.returnDate) {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 7);

      returnDate = endDate;
      rentalPeriodSuggestion = {
        suggestedStart: today,
        suggestedEnd: endDate,
        message: "No return date provided. Suggesting a 7-day rental period."
      };
    } else {
      returnDate = new Date(rentalData.returnDate);
    }

    const remainingAmount = rentalData.setPrice - (rentalData.advanceRent || 0);

    const rentalOrder = new RentalOrder({
      customer: customerId,
      fleet: fleetId,
      bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
      returnDate: returnDate, // updated
      purpose: rentalData.purpose,
      setPrice: rentalData.setPrice,
      overdue: rentalData.overdue || 0,
      bond: rentalData.bond,
      advanceRent: rentalData.advanceRent,
      totalBill: rentalData.setPrice,
      amountPaid: rentalData.advanceRent || 0,
      remainingAmount: remainingAmount,
      status: 'reserved',
      paymentStatus: rentalData.advanceRent > 0 ? 'partial' : 'pending',
      inspectionName: rentalData.inspectionName || "",
    });

    await rentalOrder.save();
    fleet.status = "Rented";
    await fleet.save();

    return res.status(201).json({
      success: true,
      message: "Rental order created successfully",
      data: rentalOrder,
      ...(rentalPeriodSuggestion && { rentalPeriodSuggestion })
    });
  } catch (error) {
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

//Get all rental orders for a specific fleetId
export const getRentalsByFleetId = async (req, res, next) => {
    try {
        const { fleetId } = req.params;
        if (!fleetId) {
            return next(new ErrorHandler("Missing fleetId parameter", 400));
        }
        const rentals = await RentalOrder.find({ fleet: fleetId })
            .sort({ bookingDate: -1 }) // newest first
            .limit(1) // just the last one
            .populate("customer")
            .populate("fleet");
        res.status(200).json({ success: true, rentals });
    } catch (error) {
        next(error);
    }
};

//Get all rental orders for a specific customerId
export const getRentalsByCustomerId = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        if (!customerId) {
            return next(new ErrorHandler("Missing customerId parameter", 400));
        }
        const rentals = await RentalOrder.find({ customer: customerId })
            .sort({ bookingDate: -1 }) // newest first
            .populate("customer")
            .populate("fleet");
        res.status(200).json({ success: true, rentals });
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

// Update rental status and fleet status for prevent overbooking error or create new rental order
export const updateRentalStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['reserved', 'active', 'completed', 'cancelled'].includes(status)) {
            return next(new ErrorHandler("Invalid or missing rental status", 400));
        }

        const rental = await RentalOrder.findById(id).populate("fleet");
        if (!rental) {
            return next(new ErrorHandler("Rental order not found", 404));
        }

        // Update rental status
        rental.status = status;

        // If completed or cancelled, set fleet status to "Available"
        if (status === "completed" || status === "cancelled") {
            if (rental.fleet) {
                rental.fleet.status = "Available";
                await rental.fleet.save();
            }
        }

        //If it is reserved or active status will be Rental on fleets
        if (status === "reserved" || status === "active") {
            if (rental.fleet) {
                rental.fleet.status = "Rented";
                await rental.fleet.save();
            }
        }

        await rental.save();

        return res.status(200).json({
            success: true,
            message: "Rental status updated successfully",
            rental,
        });
    } catch (error) {
        next(error);
    }
};

// Update inspection name and finalize rental by fleet ID
export const updateInspectionNameByFleetId = async (req, res, next) => {
    try {
        const { fleetId } = req.params;
        const { inspectionName } = req.body;

        if (!inspectionName || inspectionName.trim() === "") {
            return next(new ErrorHandler("Inspection name is required", 400));
        }

        // Find the latest active/reserved rental for this fleet
        const rental = await RentalOrder.findOne({
            fleet: fleetId,
            status: { $in: ["reserved", "active"] }
        }).populate("fleet");

        if (!rental) {
            return next(new ErrorHandler("Active rental order not found for this fleet", 404));
        }

        rental.inspectionName = inspectionName;
        rental.paymentStatus = "paid";
        rental.status = "completed";

        // Set fleet status to Available
        if (rental.fleet) {
            rental.fleet.status = "Available";
            await rental.fleet.save();
        }

        await rental.save();

        return res.status(200).json({
            success: true,
            message: "Inspection name updated, rental finalized",
        });
    } catch (error) {
        next(error);
    }
};