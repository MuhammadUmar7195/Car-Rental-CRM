import RentalOrder from '../Model/rental.model.js';
import Customer from '../Model/customer.model.js';
import Fleet from '../Model/fleet.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';

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
        next(error);
    }
}