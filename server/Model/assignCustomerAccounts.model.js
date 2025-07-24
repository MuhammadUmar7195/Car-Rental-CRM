import mongoose from "mongoose";

const AssignCustomerAccounts = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  accountingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accounting",
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
})

const AssignCustomerAccount = mongoose.model("AssignCustomerAccount", AssignCustomerAccounts);
export default AssignCustomerAccount;