import Accounting from "../Model/accounting.model.js";

//post data to accounting
export const uploadAccountingFile = async (req, res, next) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: "Invalid or missing transactions array" });
    }

    // Add optional: Validate each transaction 
    const cleanedTransactions = transactions.map((t) => ({
      date: t.date || t.Date,
      description: t.description || t.Description,
      amount: parseFloat(t.amount || t.Amount) || 0,
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
