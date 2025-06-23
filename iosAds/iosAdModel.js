import mongoose from "mongoose";

// Ad ka schema define karna
const AdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ads_type: {
    type: String,
    required: true,
    enum: ["Google", "Facebook", "Unity", "AppLovin"], // Ads type ke options
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"], // Status ke options
  },
  application_id: {
    type: String,
    required: true,
    trim: true,
  },
  app_open_ad_code: {
    type: String,
    trim: true,
    default: "",
  },
  banner_ad_code: {
    type: String,
    trim: true,
    default: "",
  },
  interstitial_ad_code: {
    type: String,
    trim: true,
    default: "",
  },
  native_ad_code: {
    type: String,
    trim: true,
    default: "",
  },
  rewarded_ad_code: {
    type: String,
    trim: true,
    default: "",
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const IosAdsSchema = new mongoose.Schema({
  iosAdsList: [AdSchema], // iOS ads ko store karne ke liye array
});

const iosAds = mongoose.model("iosAds", IosAdsSchema);

export default iosAds;
