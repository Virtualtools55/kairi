import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Direct DB mein hashed password dal dena
  currentSessionId: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);