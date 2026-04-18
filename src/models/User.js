import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Model compile karne se pehle check karein ki wo pehle se register toh nahi hai
export default mongoose.models.User || mongoose.model("User", UserSchema);