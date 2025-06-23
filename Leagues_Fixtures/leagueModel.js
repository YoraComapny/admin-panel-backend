import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image_path: {
    type: String,
    required: true,
  },
});

const SelectedLeague = mongoose.model("SelectedLeague", leagueSchema);
export default SelectedLeague;
