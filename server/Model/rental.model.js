import mongoose from 'mongoose';

const rentalOrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  remainingBalance: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['reserved', 'active', 'completed', 'cancelled'],
    default: 'reserved'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

//This logic prevents overbooking cars and check status first
rentalOrderSchema.index(
  { vehicle: 1, status: 1 }, 
  { unique: true, partialFilterExpression: { status: { $in: ['reserved', 'active'] } } }
);

const Rental = mongoose.model('RentalOrder', rentalOrderSchema);
export default Rental;