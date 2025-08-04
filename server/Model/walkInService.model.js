import mongoose from 'mongoose';

const walkInServiceOrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    carModel: {
        type: String,
        required: true,
        trim: true,
    },
    carRegistrationNumber: {
        type: String,
        required: true,
        trim: true,
    },
    itemsUsed: [
        {
            inventoryItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true,
            },
            quantityUsed: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    totalCost: {
        type: Number,
        required: true,
    },
    serviceDate: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        trim: true,
    },
    servicedBy: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
}, { timestamps: true });

const WalkInServiceOrder = mongoose.model('WalkInServiceOrder', walkInServiceOrderSchema);
export default WalkInServiceOrder;
