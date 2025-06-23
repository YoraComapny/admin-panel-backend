import path from "path";
import multer from "multer";
import fs from "fs";
// import cloudinary from "../config/cloudinaryConfig.js";
import cloudinary from "../config/cloudinaryConfig.js";
import NotificationSetting from "./notificationModel.js";

// const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "androidSettingupload/");
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
    cb("You're allowed to uopload images only", false);
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
});

const removeImage = (file) => {
  fs.unlink("./androidSettingupload/" + file, function (err) {
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

const createAndUpdateNotification = async (req, res) => {
  try {
    const {
      android_privacy_policy,
      android_terms_conditions,
      android_app_share_link,
      android_default_page,
      ios_app_share_link,
      ios_default_page,
      notification_type,
      ios_notification_type,
      firebase_server_key,
      firebase_topic,
      ios_firebase_server_key,
      ios_firebase_topic,
      one_signal_app_id,
      one_signal_api_key,
      required_enable_app,
      application_id,
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "android_settings" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Image upload failed" });
      }
    }

    const android = await NotificationSetting.findOne();

    if (android) {
      android.general_settings = {
        android_privacy_policy:
          android_privacy_policy ||
          android.general_settings.android_privacy_policy,
        android_terms_conditions:
          android_terms_conditions ||
          android.general_settings.android_terms_conditions,
        android_app_share_link:
          android_app_share_link ||
          android.general_settings.android_app_share_link,
        android_default_page:
          android_default_page || android.general_settings.android_default_page,
        ios_app_share_link:
          ios_app_share_link || android.general_settings.ios_app_share_link,
        ios_default_page:
          ios_default_page || android.general_settings.ios_default_page,
        notification_type:
          notification_type || android.general_settings.notification_type,
        ios_notification_type:
          ios_notification_type ||
          android.general_settings.ios_notification_type,
        firebase_server_key:
          firebase_server_key || android.general_settings.firebase_server_key,
        firebase_topic:
          firebase_topic || android.general_settings.firebase_topic,
        ios_firebase_server_key:
          ios_firebase_server_key ||
          android.general_settings.ios_firebase_server_key,
        ios_firebase_topic:
          ios_firebase_topic || android.general_settings.ios_firebase_topic,
        one_signal_app_id:
          one_signal_app_id || android.general_settings.one_signal_app_id,
        one_signal_api_key:
          one_signal_api_key || android.general_settings.one_signal_api_key,
      };

      android.required_app = {
        required_enable_app:
          required_enable_app || android.required_app.required_enable_app,
        application_id: application_id || android.required_app.application_id,
      };

      await android.save();
      return res.status(200).json({
        success: true,
        message: "Settings updated successfully.",
        android,
      });
    }

    const newAndroid = new AndroidSetting({
      general_settings: {
        android_privacy_policy,
        android_terms_conditions,
        android_app_share_link,
        android_default_page,
        ios_app_share_link,
        ios_default_page,
        notification_type,
        ios_notification_type,
        firebase_server_key,
        firebase_topic,
        ios_firebase_server_key,
        ios_firebase_topic,
        one_signal_app_id,
        one_signal_api_key,
      },
      required_app: {
        required_enable_app,
        application_id,
      },
    });

    await newAndroid.save();
    res
      .status(201)
      .json({ success: true, message: "Settings created successfully." });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getNotificationSetting = async (req, res) => {
  try {
    let androidSetting = await NotificationSetting.findOne();

    if (!androidSetting) {
      androidSetting = new NotificationSetting();
      await androidSetting.save();
    }

    res.status(200).json({
      message: "notification setting found",
      settings: androidSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { upload, createAndUpdateNotification, getNotificationSetting };
