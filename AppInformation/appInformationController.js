import path from "path";
import multer from "multer";
import fs from "fs";
import AppInformation from "./appInformationModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "appInformationupload/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

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

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 2MB
  },
});

const createAndUpdateSettings = async (req, res) => {
  try {
    // Getting the post form data from request
    const {
      appName,
      app_unique_id,
      sports_api_base_url,
      sports_api_key,
      ip_api_key,
      highlights_type,
      status,
    } = req.body;

    let imageUrl = "";

    // Upload file to Cloudinary if present
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "app_information" },
          (error, uploadResult) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject("Image upload failed");
            } else {
              resolve(uploadResult.secure_url);
            }
          }
        );
        stream.end(req.file.buffer);
      });
      console.log("Uploaded Image URL:", imageUrl);
    }

    // Fetch existing settings
    const appInfo = await AppInformation.findOne();

    if (appInfo) {
      // If there is new data to update
      if (
        appName ||
        app_unique_id ||
        sports_api_base_url ||
        status ||
        sports_api_key ||
        ip_api_key ||
        highlights_type ||
        imageUrl
      ) {
        if (appInfo?.app_logo && imageUrl) {
          removeImage(appInfo.app_logo);
        }

        // Update the existing settings
        appInfo.appName = appName || appInfo.appName;
        appInfo.app_unique_id = app_unique_id || appInfo.app_unique_id;
        appInfo.sports_api_base_url =
          sports_api_base_url || appInfo.sports_api_base_url;
        appInfo.status = status || appInfo.status;
        appInfo.ip_api_key = ip_api_key || appInfo.ip_api_key;
        appInfo.highlights_type = highlights_type || appInfo.highlights_type;
        appInfo.sports_api_key = sports_api_key || appInfo.sports_api_key;
        appInfo.app_logo = imageUrl || appInfo.app_logo;

        // Save updated settings
        const updatedInfo = await appInfo.save();
        return res
          .status(200)
          .json({ success: true, message: "Success", data: updatedInfo });
      }
      return res
        .status(400)
        .json({ success: false, message: "No new data to update" });
    }

    // Create new settings if they don't exist
    if (
      appName &&
      app_unique_id &&
      sports_api_base_url &&
      ip_api_key &&
      sports_api_key
    ) {
      const newAppInfo = new AppInformation({
        appName,
        sports_api_base_url,
        status,
        app_unique_id,
        ip_api_key,
        highlights_type,
        sports_api_key,
        app_logo: imageUrl,
      });

      const settings = await newAppInfo.save();
      return res.status(200).json({
        success: true,
        message: "App Information settings created successfully",
        data: settings,
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Please enter all required fields" });
  } catch (error) {
    console.error("Error updating app information:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Remove image function
const removeImage = (file) => {
  fs.unlink("./appInformationupload/" + file, function (err) {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};

// Get route for app Information settings
const getAppInformationSettings = async (req, res) => {
  try {
    const appSettings = await AppInformation.findOne();
    let baseURL = "http://localhost:5050";
    if (process.env.NODE_ENV === "PRODUCTION") {
      baseURL = "http://localhost:8080";
    }
    if (appSettings) {
      // Create image url
      const imageURL = `${baseURL}/appInformationupload/${appSettings.app_logo}`;
      res.status(200).json({
        message: "Data retrieved successfully",
        settings: {
          ...appSettings._doc,
          app_logo: imageURL, // Replace app_logo with the full image URL
        },
      });
    } else {
      res.status(400).json({ message: "Couldn't find exisiting settings" });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err?.message,
    });
  }
};

export { getAppInformationSettings, createAndUpdateSettings, upload };
