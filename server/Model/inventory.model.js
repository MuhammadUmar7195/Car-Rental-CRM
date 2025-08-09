import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    inventoryName: {
        type: String,
        required: true,
        trim: true
    }, 
    carModel: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    costPrice: {
        type: Number,
        required: true,
        default: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        default: 0
    }
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;