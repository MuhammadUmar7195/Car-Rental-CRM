import mongoose from "mongoose";

const AccountingSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  date: String, 
  description: String, 
  amount: Number, 
});

const Accounting = mongoose.model("Accounting", AccountingSchema);
export default Accounting;