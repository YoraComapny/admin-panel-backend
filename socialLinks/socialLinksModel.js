// import mongoose from "mongoose";

// const countrySchema = new mongoose.Schema({
//   countryArray: {
//     type: [String],
//     required: true,
//     unique: true,
//   },
// });

// const Country = mongoose.model("Country", countrySchema);

// export default Country;

import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      trim: true,
      default: "",
    },
    instagram: {
      type: String,
      trim: true,
      default: "",
    },
    twitter: {
      type: String,
      trim: true,
      default: "",
    },
    telegram: {
      type: String,
      trim: true,
      default: "",
    },
    youtube: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the model
const SocialLinks = mongoose.model("SocialLinks", socialLinksSchema);

// Default export
export default SocialLinks;
