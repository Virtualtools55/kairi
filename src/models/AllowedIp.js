import mongoose from "mongoose";

const AllowedIpSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      unique: true, // Ek IP baar-baar duplicate na ho
      trim: true,
    },
    description: {
      type: String, // Pehchan ke liye (e.g., "Ankit Home Wi-Fi", "Office IP")
      default: "Whitelisted Access IP",
    },
  },
  { timestamps: true }
);

export default mongoose.models.AllowedIp || mongoose.model("AllowedIp", AllowedIpSchema);