import AssignCustomerAccount from "../Model/assignCustomerAccounts.model.js";

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
