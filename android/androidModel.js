import mongoose from "mongoose";

const SettingsSchema = mongoose.Schema(
  {
    ios_privacy_policy: {
      type: String,
      trim: true,
      default: "",
    },
    ios_terms_conditions: {
      type: String,
      trim: true,
      default: "",
    },
    ios_app_share_link: {
      type: String,
      trim: true,
      default: "",
    },
    app_rating_link: {
      type: String,
      trim: true,
      default: "",
    },
    app_default_page: {
      type: String,
      trim: true,
      default: "Home",
    },
    app_publishing_control: {
      type: String,
      trim: true,
      default: "On",
    },
    hide_live_by_version_code: {
      type: String,
      trim: true,
      default: "",
    },
    primary_ads_type: {
      type: String,
      trim: true,
      default: "",
    },
    multiple_ad_service: {
      type: String,
      trim: true,
      default: "Enable",
    },
    others_ads_type: {
      type: String,
      trim: true,
      default: "",
    },
    ad_switch: {
      type: String,
      trim: true,
      default: "",
    },
    interstitial_click_control: {
      type: String,
      trim: true,
      default: "0",
    },
    ads_status: {
      type: String,
      trim: true,
      default: "Enable",
    },
    version_name: {
      type: String,
      trim: true,
      default: "",
    },
    version_code: {
      type: String,
      trim: true,
      default: "",
    },
    force_update: {
      type: String,
      trim: true,
      default: "Yes",
    },
    update_for: {
      type: String,
      trim: true,
      default: "In Store",
    },
    app_url: {
      type: String,
      trim: true,
      default: "",
    },
    button_text: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    required_enable_app: {
      type: String,
      trim: true,
      default: "Yes",
    },
    application_id: {
      type: String,
      trim: true,
      default: "",
    },
    required_app_url: {
      type: String,
      trim: true,
      default: "",
    },
    app_name: {
      type: String,
      trim: true,
      default: "",
    },
    required_description: {
      type: String,
      trim: true,
      default: "",
    },
    promotion_status: {
      type: String,
      trim: true,
      default: "Active",
    },
    button_name: {
      type: String,
      trim: true,
      default: "",
    },
    promotion_text: {
      type: String,
      trim: true,
      default: "",
    },
    promotion_link: {
      type: String,
      trim: true,
      default: "",
    },
    logo_url: {
      type: String,
      trim: true,
      default: "",
    }, // URL of the logo
    logo_file: {
      type: String,
      trim: true,
      default: "",
    }, // Path to the uploaded file
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const AndroidSettings = mongoose.model("AndroidSettings", SettingsSchema);

export default AndroidSettings;
