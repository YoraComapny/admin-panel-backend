import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "League name is required"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const typesLeague = mongoose.model("typesLeague", leagueSchema);

export default typesLeague;
