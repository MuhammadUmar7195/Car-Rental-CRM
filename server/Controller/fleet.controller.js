import ErrorHandler from '../Utils/ErrorHandler.js';
import Fleet from '../Model/fleet.model.js';

export const postFleet = async (req, res, next) => {
    try {
        const {
            model,
            year,
            registration,
            fuel,
            insurance,
            owner,
            vin,
            engine,
            color,
            type,
            odometer,
            transmission,
            regExpiry,
            inspExpiry,
            businessUse
        } = req.body;

        if (!model || !year || !registration || !fuel || !insurance || !owner || !vin || !engine || !color || !type || !odometer || !transmission || !regExpiry || !inspExpiry || !businessUse) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        const newFleet = new Fleet({
            model,
            year,
            registration,
            fuel,
            insurance,
            owner,
            vin,
            engine,
            color,
            type,
            odometer,
            transmission,
            regExpiry,
            inspExpiry,
            businessUse
        });

        await newFleet.save();
        res.status(201).json({ message: "Fleet added successfully", newFleet });
    } catch (error) {
        next(error);
    }
};

// Get All Fleets (no filter)
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