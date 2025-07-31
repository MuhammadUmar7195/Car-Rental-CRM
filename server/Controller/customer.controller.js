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

//Delete a customer by ID
export const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return next(new ErrorHandler("Customer not found", 404));
        }
        res.status(200).json({ message: "Customer deleted successfully" });
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

//Get customer with their name or license number just 
export const getCustomerByNameOrLicense = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return next(new ErrorHandler("Query parameter is required", 400));
        }
        const regex = new RegExp(query, 'i'); 
        const customers = await Customer.find({
            $or: [
                { name: regex },
                { licenseNo: regex }
            ]
        });
        if (customers.length === 0) {
            return next(new ErrorHandler("No customers found", 404));
        }
        res.status(200).json({ customers });
    } catch (error) {
        next(error);
    }
};