import Accounting from "../Model/accounting.model.js";
import Rental from "../Model/rental.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";

//post data to accounting
export const uploadAccountingFile = async (req, res, next) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return next(new ErrorHandler("Invalid or missing transactions array", 400));
    }

    // Add optional: Validate each transaction 
    const cleanedTransactions = transactions.map((t) => ({
      date: t.date || t.Date,
      description: t.description || t.Description,
      amount: Math.abs(parseFloat(t.amount || t.Amount) || 0),
    }));

    // Save to MongoDB
    await Accounting.insertMany(cleanedTransactions);

    res.status(200).json({
      success: true,
      message: "Data uploaded and saved to DB",
    });
  } catch (error) {
    next(error);
  }
};

//fetch data from accounting
export const getAllAccountingData = async (req, res, next) => {
  try {
    const accounting = await Accounting.find({});
    res.status(200).json({
      success: true,
      accounting,
    });
  } catch (error) {
    next(error);
  }
};

//now delete accounting data by id
export const deleteSingleAccountingData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const accountingData = await Accounting.findByIdAndDelete(id);

    if (!accountingData) {
      return next(new ErrorHandler("Accounting data not found", 404));
    }

    res.status(200).json({ message: "Accounting data deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// Assign a customer to an accounting entry
export const assignCustomerToAccounting = async (req, res, next) => {
  try {
    const { customerId, accountingId, rentalOrderId } = req.body;

    if (!customerId || !accountingId || !rentalOrderId) {
      return next(new ErrorHandler("customerId, accountingId, and rentalOrderId are required.", 400));
    }

    const accountingEntry = await Accounting.findById(accountingId);
    if (!accountingEntry) {
      return next(new ErrorHandler("Accounting entry not found.", 404));
    }

    const rentalOrder = await Rental.findById(rentalOrderId);
    if (!rentalOrder) {
      return next(new ErrorHandler("Rental order not found.", 404));
    }

    const paidGrandTotal = (rentalOrder.amountPaid || 0) + (accountingEntry.amount || 0);
    const remainingAmount = (rentalOrder.totalBill || 0) - paidGrandTotal;

    // Save to rentalOrder and/or accounting entry
    rentalOrder.amountPaid = paidGrandTotal;
    rentalOrder.remainingAmount = remainingAmount;
    await rentalOrder.save();

    accountingEntry.remainingAmount = remainingAmount;

    // Prepare snapshot for rental order persistence in backend
    const rentalOrderSnapshot = {
      _id: rentalOrder._id,
      purpose: rentalOrder.purpose,
      bookingDate: rentalOrder.bookingDate,
      returnDate: rentalOrder.returnDate,
      status: rentalOrder.status,
      totalBill: rentalOrder.totalBill,
      amountPaid: rentalOrder.amountPaid,
      remainingAmount: rentalOrder.remainingAmount,
    };

    accountingEntry.rentalOrderSnapshot = rentalOrderSnapshot;
    await accountingEntry.save();

    // Assign or update the entry
    const updatedEntry = await Accounting.findByIdAndUpdate(
      accountingId,
      {
        customerId: customerId,
        rentalOrderId: rentalOrderId,
        assignedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('rentalOrderId');

    return res.status(200).json({
      message: "Customer assigned successfully!",
      data: updatedEntry,
    });
  } catch (error) {
    next(error);
  }
};

// Check if an accounting entry is assigned to a customer
export const checkIfAssigned = async (req, res, next) => {
  try {
    const { accountingId } = req.params;

    if (!accountingId) {
      return next(new ErrorHandler("accountingId is required.", 400));
    }

    const accountingEntry = await Accounting.findById(accountingId);

    if (!accountingEntry) {
      return next(new ErrorHandler("Accounting entry not found.", 404));
    }

    const isAssigned = accountingEntry.customerId ? true : false;

    return res.status(200).json({
      message: "Assignment check successful",
      isAssigned,
    });
  } catch (error) {
    next(error);
  }
};

// Get accounting details with single customerId 
export const getAccountingDetailWithCustomerId = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return next(new ErrorHandler("customerId is required.", 400));
    }

    const assignments = await Accounting.find({ customerId });

    return res.status(200).json({
      message: "Assigned payments retrieved successfully!",
      payments: assignments,
    });
  } catch (error) {
    next(error);
  }
}

//Get accounting and rental details by customerId (Basically this is for payment history in customer component)
export const getAccountingAndRentalsByCustomerId = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return next(new ErrorHandler("customerId is required in body.", 400));
    }

    // Get all accounting entries for this customer, with rentalOrder populated
    const accountingEntries = await Accounting.find({ customerId })
      .populate('rentalOrderId');

    return res.status(200).json({
      success: true,
      accounting: accountingEntries,
    });
  } catch (error) {
    next(error);
  }
};