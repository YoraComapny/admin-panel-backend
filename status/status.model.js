import mongoose from "mongoose";

const uploadStatusSchema = new mongoose.Schema(
  {
    imageFootBall: {
      type: String,
      required: false,
    },
    imageTeam: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const UploadStatus = mongoose.model("UploadStatus", uploadStatusSchema);

export default UploadStatus;
