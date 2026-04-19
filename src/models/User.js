import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
  // Reset Password Fields
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpire: {
    type: Date,
    required: false,
  },
}, { 
  timestamps: true // Isse 'createdAt' aur 'updatedAt' apne aap ban jayenge
});

// Model compile karne se pehle check karein ki wo pehle se register toh nahi hai
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;