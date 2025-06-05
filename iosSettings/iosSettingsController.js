// import path from "path";
// import multer from "multer";
// import fs from "fs";
// import IosSettings from "./iosModel.js";

// let baseURL = process.env.BaseURL;
// if (process.env.NODE_ENV === "PRODUCTION") {
//   baseURL = "http://localhost:8080";
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "upload/");
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png|jfif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("You're allowed to uopload images only", false);
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     cb(null, file); // Accept all the files
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024, // limit to 2MB
//   },
// });

// const removeImage = (file) => {
//   fs.unlink("./upload/" + file, function (err) {
//     if (err && err.code == "ENOENT") {
//       // file doens't exist
//       console.info("File doesn't exist, won't remove it.");
//     } else if (err) {
//       // other errors, e.g. maybe we don't have enough permission
//       console.error("Error occurred while trying to remove file");
//     } else {
//       console.info(`removed`);
//     }
//   });
// };

// const createAndUpdateIos = async (req, res) => {
//   const {
//     ios_privacy_policy,
//     ios_terms_conditions,
//     ios_app_share_link,
//     app_rating_link,
//     app_default_page,
//     app_publishing_control,
//     hide_live_by_version_code,
//     primary_ads_type,
//     multiple_ad_service,
//     others_ads_type,
//     ad_switch,
//     interstitial_click_control,
//     ads_status,
//     version_name,
//     version_code,
//     force_update,
//     update_for,
//     app_url,
//     button_text,
//     description,
//     required_enable_app,
//     application_id,
//     required_app_url,
//     app_name,
//     required_description,
//     promotion_status,
//     button_name,
//     promotion_text,
//     promotion_link,
//   } = req.body;

//   const filename = req?.file?.filename || ""; // For the uploaded logo file

//   try {
//     // Find existing settings or create new ones
//     let ios = await IosSettings.findOne();

//     if (ios) {
//       // Update existing settings
//       ios.ios_privacy_policy = ios_privacy_policy || ios.ios_privacy_policy;
//       ios.ios_terms_conditions =
//         ios_terms_conditions || ios.ios_terms_conditions;
//       ios.ios_app_share_link = ios_app_share_link || ios.ios_app_share_link;
//       ios.app_rating_link = app_rating_link || ios.app_rating_link;
//       ios.app_default_page = app_default_page || ios.app_default_page;
//       ios.app_publishing_control =
//         app_publishing_control || ios.app_publishing_control;
//       ios.hide_live_by_version_code =
//         hide_live_by_version_code || ios.hide_live_by_version_code;
//       ios.primary_ads_type = primary_ads_type || ios.primary_ads_type;
//       ios.multiple_ad_service = multiple_ad_service || ios.multiple_ad_service;
//       ios.others_ads_type = others_ads_type || ios.others_ads_type;
//       ios.ad_switch = ad_switch || ios.ad_switch;
//       ios.interstitial_click_control =
//         interstitial_click_control || ios.interstitial_click_control;
//       ios.ads_status = ads_status || ios.ads_status;
//       ios.version_name = version_name || ios.version_name;
//       ios.version_code = version_code || ios.version_code;
//       ios.force_update = force_update || ios.force_update;
//       ios.update_for = update_for || ios.update_for;
//       ios.app_url = app_url || ios.app_url;
//       ios.button_text = button_text || ios.button_text;
//       ios.description = description || ios.description;
//       ios.required_enable_app = required_enable_app || ios.required_enable_app;
//       ios.application_id = application_id || ios.application_id;
//       ios.required_app_url = required_app_url || ios.required_app_url;
//       ios.app_name = app_name || ios.app_name;
//       ios.required_description =
//         required_description || ios.required_description;
//       ios.promotion_status = promotion_status || ios.promotion_status;
//       ios.button_name = button_name || ios.button_name;
//       ios.promotion_text = promotion_text || ios.promotion_text;
//       ios.promotion_link = promotion_link || ios.promotion_link;

//       // Handle logo file update
//       if (filename) {
//         if (ios.logo_file) {
//           removeImage(ios.logo_file); // Remove the old logo file if it exists
//         }
//         ios.logo_url = `http://localhost:5000/uploads/${filename}`; // Update logo URL
//         ios.logo_file = filename; // Update logo file path
//       }

//       const updatedIos = await ios.save();
//       res.status(200).json({
//         success: true,
//         message: "Settings updated successfully.",
//         data: updatedIos,
//       });
//     } else {
//       // Create new settings
//       const newIos = new IosSettings({
//         ios_privacy_policy,
//         ios_terms_conditions,
//         ios_app_share_link,
//         app_rating_link,
//         app_default_page,
//         app_publishing_control,
//         hide_live_by_version_code,
//         primary_ads_type,
//         multiple_ad_service,
//         others_ads_type,
//         ad_switch,
//         interstitial_click_control,
//         ads_status,
//         version_name,
//         version_code,
//         force_update,
//         update_for,
//         app_url,
//         button_text,
//         description,
//         required_enable_app,
//         application_id,
//         required_app_url,
//         app_name,
//         required_description,
//         promotion_status,
//         button_name,
//         promotion_text,
//         promotion_link,
//         logo_url: filename ? `http://localhost:5000/uploads/${filename}` : "",
//         logo_file: filename || "",
//       });

//       await newIos.save();
//       res.status(200).json({
//         success: true,
//         message: "Settings created successfully.",
//         data: newIos,
//       });
//     }
//   } catch (error) {
//     console.error("Error in createAndUpdateIos:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while processing your request.",
//       error: error.message,
//     });
//   }
// };

// const getIosSettings = async (req, res) => {
//   try {
//     // Fetch the iOS settings from the database
//     const ios = await IosSettings.findOne();

//     // If settings are found
//     if (ios) {
//       // Construct the full URL for the logo if it exists
//       const logoURL = ios.logo_file
//         ? `${baseURL}/uploads/${ios.logo_file}`
//         : null;

//       // Add the logo URL to the response object
//       const responseData = {
//         ...ios.toObject(), // Convert Mongoose document to a plain JavaScript object
//         logo_url: logoURL, // Override or add the logo URL
//       };

//       // Send the response
//       res.status(200).json({
//         success: true,
//         message: "iOS settings found",
//         settings: responseData,
//       });
//     } else {
//       // If no settings are found
//       res.status(404).json({
//         success: false,
//         message: "iOS settings not found",
//       });
//     }
//   } catch (error) {
//     // Handle errors
//     console.error("Error in getIosSettings:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// export { upload, createAndUpdateIos, getIosSettings };

import path from "path";
import multer from "multer";
import fs from "fs";
import IosSettings from "./iosModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

let baseURL = process.env.BaseURL;
if (process.env.NODE_ENV === "PRODUCTION") {
  baseURL = "http://localhost:8080";
}

// Create temporary storage for multer
const storage = multer.memoryStorage(); // Using memory storage instead of disk storage for Cloudinary

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|jfif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("You're allowed to upload images only", false);
  }
}

export const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
});

// Function to remove image from local storage (if needed)
const removeImage = (file) => {
  fs.unlink("./upload/" + file, function (err) {
    if (err && err.code == "ENOENT") {
      // file doesn't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};

export const createAndUpdateIos = async (req, res) => {
  try {
    const {
      ios_privacy_policy,
      ios_terms_conditions,
      ios_app_share_link,
      app_rating_link,
      app_default_page,
      app_publishing_control,
      hide_live_by_version_code,
      primary_ads_type,
      multiple_ad_service,
      others_ads_type,
      ad_switch,
      interstitial_click_control,
      ads_status,
      version_name,
      version_code,
      force_update,
      update_for,
      app_url,
      button_text,
      description,
      required_enable_app,
      application_id,
      required_app_url,
      app_name,
      required_description,
      promotion_status,
      button_name,
      promotion_text,
      promotion_link,
    } = req.body;

    let logoUrl = "";
    let filename = "";

    // Upload file to Cloudinary if present
    if (req.file) {
      logoUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ios_settings-modoifi" },
          (error, uploadResult) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject("Image upload failed");
            } else {
              resolve(uploadResult.secure_url);
              filename = uploadResult.public_id; // Store public_id for future reference
            }
          }
        );
        stream.end(req.file.buffer);
      });
      console.log("Uploaded Image URL:", logoUrl);
    }

    // Find existing settings or create new ones
    let ios = await IosSettings.findOne();

    if (ios) {
      // Update existing settings
      ios.ios_privacy_policy = ios_privacy_policy || ios.ios_privacy_policy;
      ios.ios_terms_conditions =
        ios_terms_conditions || ios.ios_terms_conditions;
      ios.ios_app_share_link = ios_app_share_link || ios.ios_app_share_link;
      ios.app_rating_link = app_rating_link || ios.app_rating_link;
      ios.app_default_page = app_default_page || ios.app_default_page;
      ios.app_publishing_control =
        app_publishing_control || ios.app_publishing_control;
      ios.hide_live_by_version_code =
        hide_live_by_version_code || ios.hide_live_by_version_code;
      ios.primary_ads_type = primary_ads_type || ios.primary_ads_type;
      ios.multiple_ad_service = multiple_ad_service || ios.multiple_ad_service;
      ios.others_ads_type = others_ads_type || ios.others_ads_type;
      ios.ad_switch = ad_switch || ios.ad_switch;
      ios.interstitial_click_control =
        interstitial_click_control || ios.interstitial_click_control;
      ios.ads_status = ads_status || ios.ads_status;
      ios.version_name = version_name || ios.version_name;
      ios.version_code = version_code || ios.version_code;
      ios.force_update = force_update || ios.force_update;
      ios.update_for = update_for || ios.update_for;
      ios.app_url = app_url || ios.app_url;
      ios.button_text = button_text || ios.button_text;
      ios.description = description || ios.description;
      ios.required_enable_app = required_enable_app || ios.required_enable_app;
      ios.application_id = application_id || ios.application_id;
      ios.required_app_url = required_app_url || ios.required_app_url;
      ios.app_name = app_name || ios.app_name;
      ios.required_description =
        required_description || ios.required_description;
      ios.promotion_status = promotion_status || ios.promotion_status;
      ios.button_name = button_name || ios.button_name;
      ios.promotion_text = promotion_text || ios.promotion_text;
      ios.promotion_link = promotion_link || ios.promotion_link;

      // Handle logo file update
      if (logoUrl) {
        // If there was a previous Cloudinary image, you could delete it here
        // using cloudinary.uploader.destroy(ios.logo_file)
        ios.logo_url = logoUrl; // Update logo URL with Cloudinary URL
        ios.logo_file = filename; // Store reference to the Cloudinary public_id
      }

      const updatedIos = await ios.save();
      res.status(200).json({
        success: true,
        message: "Settings updated successfully.",
        data: updatedIos,
      });
    } else {
      // Create new settings
      const newIos = new IosSettings({
        ios_privacy_policy,
        ios_terms_conditions,
        ios_app_share_link,
        app_rating_link,
        app_default_page,
        app_publishing_control,
        hide_live_by_version_code,
        primary_ads_type,
        multiple_ad_service,
        others_ads_type,
        ad_switch,
        interstitial_click_control,
        ads_status,
        version_name,
        version_code,
        force_update,
        update_for,
        app_url,
        button_text,
        description,
        required_enable_app,
        application_id,
        required_app_url,
        app_name,
        required_description,
        promotion_status,
        button_name,
        promotion_text,
        promotion_link,
        logo_url: logoUrl || "",
        logo_file: filename || "",
      });

      await newIos.save();
      res.status(200).json({
        success: true,
        message: "Settings created successfully.",
        data: newIos,
      });
    }
  } catch (error) {
    console.error("Error in createAndUpdateIos:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
};

export const getIosSettings = async (req, res) => {
  try {
    // Fetch the iOS settings from the database
    const ios = await IosSettings.findOne();

    if (!ios) {
      return res.status(404).json({
        success: false,
        message: "iOS settings not found",
      });
    }

    // Convert the Mongoose document to a plain JavaScript object
    const responseData = {
      ...ios.toObject(),
    };

    // Send the response with the Cloudinary URL already stored in logo_url
    res.status(200).json({
      success: true,
      message: "iOS settings found",
      settings: responseData,
    });
  } catch (error) {
    console.error("Error in getIosSettings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
