import mongoose from "mongoose";

const sportsTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sports type name is required"],
      trim: true,
      unique: true,
    },
    skq: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      trim: true,
    },
  },
  { timestamps: true }
);

const SportsType = mongoose.model("SportsType", sportsTypeSchema);

export default SportsType;
