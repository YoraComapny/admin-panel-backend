import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image_path: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const League = mongoose.model("League", leagueSchema);
export default League;
