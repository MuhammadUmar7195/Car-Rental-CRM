import mongoose from 'mongoose';

const rentalOrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  fleet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fleet',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  returnDate: {
    type: Date,
  },
  purpose: {
    type: String,
    required: true
  },
  setPrice: {
    type: Number,
    required: true
  },
  overdue: {
    type: Number,
    default: 0
  },
  bond: {
    type: Number,
    required: true
  },
  advanceRent: {
    type: Number,
    required: true
  },
  totalBill: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['reserved', 'active', 'completed', 'cancelled'],
    default: 'reserved'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'refunded', 'failed'],
    default: 'pending'
  },
  inspectionName: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

// Prevent overbooking
rentalOrderSchema.index(
  { fleet: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['reserved', 'active'] }
    }
  }
);

const Rental = mongoose.model('RentalOrder', rentalOrderSchema);
export default Rental;