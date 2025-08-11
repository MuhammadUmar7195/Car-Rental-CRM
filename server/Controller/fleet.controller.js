import ErrorHandler from '../Utils/ErrorHandler.js';
import Fleet from '../Model/fleet.model.js';
import Rental from '../Model/rental.model.js';
import ServiceOrder from '../Model/service.model.js';

//Post Fleet
export const postFleet = async (req, res, next) => {
    try {
        const {
            carName,
            model,
            year,
            pricePerDay,
            registration,
            fuel,
            insurance,
            owner,
            vin,
            engine,
            color,
            type,
            odometer,
            category,
            transmission,
            regExpiry,
            inspExpiry,
            businessUse,
            status,
            images
        } = req.body;

        // Only check for required fields that are actually being updated (allow partial updates)
        const requiredFields = [carName, model, year, pricePerDay, registration, fuel, insurance, owner, vin, engine, color, type, odometer, category, transmission, regExpiry, inspExpiry, businessUse, status, images];
        if (requiredFields.some(field => typeof field === 'undefined')) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        const newFleet = new Fleet({
            carName,
            model,
            year,
            pricePerDay,
            registration,
            fuel,
            insurance,
            owner,
            vin,
            engine,
            color,
            type,
            odometer,
            category,
            transmission,
            regExpiry,
            inspExpiry,
            businessUse,
            status,
            images
        });

        await newFleet.save();
        res.status(201).json({ message: "Fleet added successfully", newFleet });
    } catch (error) {
        next(error);
    }
};

// Get All Fleets 
export const getAllFleets = async (req, res, next) => {
    try {
        const fleets = await Fleet.find();
        if (!fleets) {
            return next(new ErrorHandler("No fleets found", 404));
        }
        res.status(200).json({ fleets });
    } catch (error) {
        next(error);
    }
};

//Single Fleet
export const getSingleFleet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fleet = await Fleet.findById(id);
        if (!fleet) {
            return next(new ErrorHandler("Fleet not found", 404));
        }
        res.status(200).json({ fleet });
    } catch (error) {
        next(error);
    }
};

//delete Fleet
export const deleteFleet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedFleet = await Fleet.findByIdAndDelete(id);
        if (!deletedFleet) {
            return next(new ErrorHandler("Fleet not found", 404));
        }
        res.status(200).json({ message: "Fleet deleted successfully" });
    } catch (error) {
        next(error);
    }
};

//update Fleet
export const updateFleet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            carName,
            model,
            year,
            pricePerDay,
            registration,
            fuel,
            insurance,
            owner,
            vin,
            engine,
            color,
            type,
            odometer,
            category,
            transmission,
            regExpiry,
            inspExpiry,
            businessUse,
            status,
            images
        } = req.body;

        if (!carName || !model || !year || !pricePerDay || !registration || !fuel || !insurance || !owner || !vin || !engine || !color || !type || !odometer || !category || !transmission || !regExpiry || !inspExpiry || !businessUse || !status || !images) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        const updatedFleet = await Fleet.findByIdAndUpdate(id, {
            carName,
            model,
            year,
            pricePerDay,
            registration,
            fuel,
            insurance,
            owner,
            vin,
            engine,
            color,
            type,
            odometer,
            category,
            transmission,
            regExpiry,
            inspExpiry,
            businessUse,
            status,
            images
        }, { new: true });

        if (!updatedFleet) {
            return next(new ErrorHandler("Fleet not found", 404));
        }

        res.status(200).json({ message: "Fleet updated successfully", updatedFleet });
    } catch (error) {
        next(error);
    }
}

//get cars name according to status
export const getCarsByStatus = async (req, res, next) => {
    try {
        const { status } = req.query;
        if (!status) {
            return next(new ErrorHandler("Status query parameter is required", 400));
        }

        const fleets = await Fleet.find({ status });
        if (!fleets || fleets.length === 0) {
            return next(new ErrorHandler("No fleets found for the given status", 404));
        }

        res.status(200).json({ fleets });
    } catch (error) {
        next(error);
    }
};

//get total car count and aviable status cars 
export const getTotalCarCount = async (req, res, next) => {
    try {
        const totalCars = await Fleet.countDocuments();
        const availableCars = await Fleet.countDocuments({ status: 'Available' });

        //Calculate sales 
        const rental = await Rental.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalBill" }
                }
            }
        ]);
        const inventory = await ServiceOrder.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalCost" }
                } 
            }
        ]);

        const rentalAmount = rental[0]?.totalAmount || 0;
        const inventoryAmount = inventory[0]?.totalAmount || 0;

        let total = rentalAmount + inventoryAmount;

        res.status(200).json({
            success: true,
            totalCars,
            availableCars, 
            totalSales: total
        });
    } catch (error) {
        next(error);
    }
};