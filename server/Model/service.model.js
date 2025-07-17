import mongoose from 'mongoose';

const serviceOrderSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fleet',
        required: true
    },
    itemsUsed: [
        {
            inventoryItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true
            },
            quantityUsed: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalCost: {
        type: Number,
        required: true
    },
    serviceDate: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        trim: true
    },
    servicedBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

const ServiceOrder = mongoose.model('ServiceOrder', serviceOrderSchema);
export default ServiceOrder;
