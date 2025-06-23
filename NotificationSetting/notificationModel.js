import mongoose from "mongoose";

const notificationSettingSchema = mongoose.Schema({
  general_settings: {
    android_privacy_policy: {
      type: String,
      trim: true,
      default: "",
    },
    android_terms_conditions: {
      type: String,
      trim: true,
      default: "",
    },
    android_app_share_link: {
      type: String,
      trim: true,
      default: "",
    },
    one_signal_app_id: {
      type: String,
      trim: true,
      default: "",
    },
    one_signal_api_key: {
      type: String,
      trim: true,
      default: "",
    },
    android_default_page: {
      type: String,
      trim: true,
      default: "",
    },
    ios_app_share_link: {
      type: String,
      trim: true,
      default: "",
    },
    ios_default_page: {
      type: String,
      trim: true,
      default: "",
    },
    notification_type: {
      type: String,
      default: "",
      trim: true,
    },
    ios_notification_type: {
      type: String,
      trim: true,
      default: "",
    },
    firebase_server_key: {
      type: String,
      trim: true,
      default: "",
    },
    firebase_topic: {
      type: String,
      trim: true,
      default: "",
    },
    ios_firebase_server_key: {
      type: String,
      trim: true,
      default: "",
    },
    ios_firebase_topic: {
      type: String,
      trim: true,
      default: "",
    },
  },
  required_app: {
    required_enable_app: {
      type: String,
      trim: true,
      default: "",
    },
    application_id: {
      type: String,
      trim: true,
      default: "",
    },
  },
});

const NotificationSetting = mongoose.model(
  "NotificationSetting",
  notificationSettingSchema
);

export default NotificationSetting;
