import RentalOrder from '../Model/rental.model.js';
import Customer from '../Model/customer.model.js';
import Fleet from '../Model/fleet.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';

export const createRentalOrder = async (req, res, next) => {
    try {
        const { customerId, vehicleId, rentalData } = req.body;

        const customer = await Customer.findById(customerId);
        const fleet = await Fleet.findById(vehicleId);

        if (!customer || !fleet) {
            return next(new ErrorHandler('Customer or vehicle not found', 404));
        }

        if (!fleet.isAvailable) {
            return next(new ErrorHandler('Vehicle is not available for rental', 400));
        }

        const startDate = new Date(rentalData.startDate);
        const endDate = new Date(rentalData.endDate);
        const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
        const totalPrice = days * fleet.dailyRate;

        const rentalOrder = new RentalOrder({
            customer: customerId,
            fleet: vehicleId,
            startDate,
            endDate,
            totalPrice,
            ...rentalData
        });
        await rentalOrder.save();

        fleet.isAvailable = false;
        await fleet.save();

        return res.status(201).json({ success: true, message: "Rental order created successfully", rentalOrder });
    } catch (error) {
        next(error);
    }
}