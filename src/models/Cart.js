import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Aapke User model ka naam
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  }
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);