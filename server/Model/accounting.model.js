import mongoose from "mongoose";

const AccountingSchema = new mongoose.Schema({
  date: String, 
  description: String, 
  amount: Number, 
});

const Accounting = mongoose.model("Accouting", AccountingSchema);
export default Accounting;
