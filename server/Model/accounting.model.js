import mongoose from "mongoose";

const AccountingSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  date: String, 
  description: String, 
  amount: Number, 
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

const Accounting = mongoose.model("Accounting", AccountingSchema);
export default Accounting;