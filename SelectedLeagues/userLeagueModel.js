import mongoose from "mongoose";

const userLeagueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "League",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  leagueName: {
    // Add this field to match your DB index
    type: String,
  },
  image_path: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  unique_id: {
    type: Number,
    required: true,
  },
});

// Update index to match what's in your database
userLeagueSchema.index({ user: 1, leagueName: 1 }, { unique: true });

const UserLeague = mongoose.model("UserLeague", userLeagueSchema);
export default UserLeague;
