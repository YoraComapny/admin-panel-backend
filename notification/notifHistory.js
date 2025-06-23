import mongoose from "mongoose";

const notificationHistorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const NotificationHistory = mongoose.model(
  "NotificationHistory",
  notificationHistorySchema
);

export default NotificationHistory;
