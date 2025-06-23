import mongoose from "mongoose";

const appInformationSchema = mongoose.Schema({
  appName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  app_unique_id: {
    type: String,
    required: true,
    trim: true,
  },
  sports_api_base_url: {
    type: String,
    required: true,
    trim: true,
  },
  sports_api_key: {
    type: String,
    required: true,
    trim: true,
  },
  ip_api_key: {
    type: String,
    required: true,
    trim: true,
  },
  highlights_type: {
    type: String,
    trim: true,
  },
  app_logo: {
    type: String,
    trim: true,
  },
  status: {
    type: Boolean,
    trim: true,
  },
});

const AppInformation = mongoose.model("App-Information", appInformationSchema);

export default AppInformation;
