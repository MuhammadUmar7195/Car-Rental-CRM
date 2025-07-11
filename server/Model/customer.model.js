import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    licenseNo: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    dcNumber: { type: String, required: true },
    suburb: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
