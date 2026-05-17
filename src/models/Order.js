import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      title: String,
      quantity: Number,
      price: Number,
    }
  ],
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true }, 
  orderId: { type: String, required: true },    
  status: { type: String, default: "Processing" }, 
  address: { type: String }, 

  // --- OTP Verification fields ---
  deliveryOtp: { 
    type: String, 
    default: null 
  },
  otpExpires: { 
    type: Date, 
    default: null 
  },
  // -------------------------------

  createdAt: { type: Date, default: Date.now },
});

// Next.js hot reloading ke cache issue ko solve karne ke liye pehle check aur variable assignment karein
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;