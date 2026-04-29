import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpire: { type: Date },
    currentSessionId: { type: String, default: "" },
    
    // --- Yeh fields add karna zaroori hai ---
    resetPasswordToken: { 
      type: String, 
      default: undefined // Shuruat mein khali rahega
    },
    resetPasswordExpire: { 
      type: Date, 
      default: undefined 
    },
    // ----------------------------------------
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);