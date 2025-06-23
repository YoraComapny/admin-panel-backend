import mongoose from "mongoose";

const statusupdateSchema = mongoose.Schema(
  {
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Status_images = mongoose.model("Status_images", statusupdateSchema);

export default Status_images;
