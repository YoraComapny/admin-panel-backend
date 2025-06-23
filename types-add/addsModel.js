import mongoose from "mongoose";

// Define Schema
const AdsTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ads type name is required"],
      trim: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create Model
const AdsType = mongoose.model("AdsType", AdsTypeSchema);

export default AdsType;
