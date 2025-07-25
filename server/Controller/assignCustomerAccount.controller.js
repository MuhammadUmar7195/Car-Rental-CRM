import AssignCustomerAccount from "../Model/assignCustomerAccounts.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";

// Assign a customer to an accounting entry
export const assignCustomerToAccounting = async (req, res, next) => {
    try {
        const { customerId, accountingId } = req.body;

        if (!customerId || !accountingId) {
            return next(new ErrorHandler("customerId and accountingId are required.", 400));
        }

        //we check if the customer is already assigned to the accounting entry
        const alreadyAssigned = await AssignCustomerAccount.findOne({ customerId, accountingId });
        if (alreadyAssigned) {
            return next(new ErrorHandler("This customer is already assigned to this accounting entry.", 409));    
        }

        const newAssignment = await AssignCustomerAccount.create({ customerId, accountingId });

        return res.status(201).json({
            message: "Customer assigned successfully!",
            data: newAssignment,
        });
    } catch (error) {
        next(error);
    }
};

// Get assigned payments with single customer ID
export const getAssignedPaymentsByCustomerId = async (req, res, next) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return next(new ErrorHandler("customerId is required.", 400));
        }

        const assignments = await AssignCustomerAccount.find({ customerId }).populate('accountingId');

        return res.status(200).json({
            message: "Assigned payments retrieved successfully!",
            data: assignments,
        });
    } catch (error) {
        next(error);
    }
};

// In assignCustomerAccount.controller.js
export const checkIfAssigned = async (req, res, next) => {
    try {
        const { accountingId } = req.params;
        if (!accountingId) {
            return next(new ErrorHandler("accountingId is required.", 400));
        }

        const assignment = await AssignCustomerAccount.findOne({ accountingId });
        const isAssigned = assignment ? true : false;

        return res.status(200).json({
            message: "Assignment status checked successfully!",
            isAssigned,
            assignment: assignment || null,
        });
    } catch (error) {
        next(error);
    }
};