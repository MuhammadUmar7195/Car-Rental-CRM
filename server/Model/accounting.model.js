import mongoose from "mongoose";

const AccountingSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  rentalOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RentalOrder",
  },
  date: String,
  description: String,
  amount: Number,
  remainingAmount: {
    type: Number,
    default: 0,
    set: v => Math.round(v * 100) / 100, 
  },
  // this field is used to store the snapshot of rental order details at the time of assignment
  rentalOrderSnapshot: {
    type: Object, 
    default: null,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

const Accounting = mongoose.model("Accounting", AccountingSchema);
export default Accounting;