import mongoose from "mongoose";

const fleetSchema = new mongoose.Schema({
    carName: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Date, required: true },
    pricePerDay: { type: Number, required: true, default: 0 },
    registration: { type: String, required: true },
    fuel: { type: String, required: true },
    insurance: { type: String, required: true },
    owner: { type: String, required: true },
    vin: { type: String, required: true },
    engine: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    odometer: { type: Number, required: true },
    transmission: { type: String, required: true },
    regExpiry: { type: Date, required: true },
    inspExpiry: { type: Date, required: true },
    businessUse: { type: String, required: true },
    category: { type: String, enum: ["Economy", "Luxury", "SUV", "Sports"], required: true },
    status: { type: String, enum: ['Available', 'Rented'], default: 'Available' },
}, { timestamps: true });

const Fleet = mongoose.model('Fleet', fleetSchema);
export default Fleet;