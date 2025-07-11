import Customer from '../Model/customer.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';

//Add a new customer
export const postCustomer = async (req, res, next) => {
    try {
        const {
            licenseNo,
            expiryDate,
            name,
            phone,
            dcNumber,
            suburb,
            state,
            address,
            postalCode,
            email
        } = req.body;

        if (!licenseNo || !expiryDate || !name || !phone || !dcNumber || !suburb || !state || !address || !postalCode || !email) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        const newCustomer = new Customer({
            licenseNo,
            expiryDate,
            name,
            phone,
            dcNumber,
            suburb,
            state,
            address,
            postalCode,
            email
        });
        await newCustomer.save();
        res.status(201).json({ message: "Customer added successfully", newCustomer });
    } catch (error) {
        next(error);
    }
};

// Get all customers
export const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({ customers });
    } catch (error) {
        next(error);
    }
};

// Get a single customer by ID
export const getSingleCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) {
            return next(new ErrorHandler("Customer not found", 404));
        }
        res.status(200).json({ customer });
    } catch (error) {
        next(error);
    }
};

// Update a customer by ID
export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body && (req.body.data || req.body);
        if (!data || typeof data !== 'object') {
            return next(new ErrorHandler("No update data provided", 400));
        }
        const updatedCustomer = await Customer.findByIdAndUpdate(id, data, { new: true });
        if (!updatedCustomer) {
            return next(new ErrorHandler("Customer not found", 404));
        }
        res.status(200).json({ message: "Customer updated successfully", updatedCustomer });
    } catch (error) {
        next(error);
    }
};
