import mongoose from "mongoose";

const mobileViewSchema = mongoose.Schema(
  {
    mobile_view: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const MobileView = mongoose.model("MobileView", mobileViewSchema);

export default MobileView;
