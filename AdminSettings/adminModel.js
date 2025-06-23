import mongoose from "mongoose";

const adminSettingSchema = mongoose.Schema(
  {
    general_settings: {
      company_name: {
        type: String,
        trim: true,
      },
      site_title: {
        type: String,
        trim: true,
      },
      time_zone: {
        type: String,
        trim: true,
      },
      language: {
        type: String,
        trim: true,
      },
      app_logo_url: {
        type: String,
        trim: true,
      },
      app_icon_url: {
        type: String,
        trim: true,
      },
    },
    social_settings: {
      facebook: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      android_app_link: {
        type: String,
        trim: true,
      },
      ios_app_link: {
        type: String,
        trim: true,
      },
    },
    privacy_policy: {
      type: String,
      trim: true,
    },
    terms_conditions: {
      type: String,
      trim: true,
    },
    contact_info: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const AdminSettings = mongoose.model("AdminSettings", adminSettingSchema);

export default AdminSettings;
