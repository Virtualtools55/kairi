import mongoose from "mongoose";
// Product model ko import karna zaroori hai populate ke liye
import Product from "./Products"; 

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpire: { type: Date },
    currentSessionId: { type: String, default: "" },
    
    // --- Cart Field (Optimized) ---
    cart: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product", // Make sure aapke Product model ka export name "Product" hi ho
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true, 
          default: 1,
          min: [1, "Quantity cannot be less than 1"] 
        },
      }
    ],

    resetPasswordToken: { 
      type: String, 
      default: undefined 
    },
    resetPasswordExpire: { 
      type: Date, 
      default: undefined 
    },
  },
  { 
    timestamps: true,
    // Ye line StrictPopulateError ko bypass karne mein help karti hai
    strictPopulate: false 
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);