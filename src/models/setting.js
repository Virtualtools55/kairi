import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // Jaise: "allow_admin_signup"
  value: { type: Boolean, default: false }
});

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);