import path from "path";
import express from "express";
import multer from "multer";
import News from "./newsModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js"; // Multer setup
import cloudinary from "../config/cloudinaryConfig.js"; // Adjust the path accordingly

const newsRoute = express.Router();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|jfif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Your allowed to uopload images only", false);
  }
}

newsRoute.post(
  "/create/news",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    console.log("1-- Request received at /create/news"); // Debugging
    console.log("Received File:", req.file); // File print karega
    console.log("Received Body:", req.body); // Body print karega

    let { title, category, image_url, publish_date, status, source_type } =
      req.body;

    console.log("2-- Raw Request body:", req.body); // Debugging
    console.log("3-- Uploaded file:", req.file); // Debugging

    // Removing unwanted whitespace and special characters
    title = title?.trim();
    category = category?.trim();
    image_url = image_url?.trim();
    publish_date = publish_date?.trim();
    status = status?.trim();

    console.log("4-- Cleaned Data:", {
      title,
      category,
      image_url,
      publish_date,
      status,
      source_type,
    });

    if (title && category && publish_date && status && source_type) {
      try {
        console.log("5-- Valid request data received"); // Debugging

        if (typeof source_type === "string") {
          try {
            source_type = JSON.parse(source_type); // Convert source_type to JSON if sent as a string
          } catch (error) {
            console.log("6-- Error parsing source_type:", error.message);
            return res.status(400).json({
              success: false,
              message: "Invalid source_type format",
            });
          }
        }

        if (source_type?.own || source_type?.other) {
          console.log("8-- Source type is valid:", source_type); // Debugging

          let uploadedImageUrl = image_url;

          if (req.file) {
            console.log("9-- Uploading image to Cloudinary..."); // Debugging

            try {
              const uploadResult = await cloudinary.uploader.upload_stream(
                { folder: "news_images" }, // Cloudinary ke folder ka naam
                async (error, result) => {
                  if (error) {
                    console.log("10-- Cloudinary Upload Error:", error.message);
                    return res.status(500).json({
                      success: false,
                      message: "Image upload failed",
                    });
                  }

                  uploadedImageUrl = result.secure_url; // Cloudinary se milne wala URL
                  console.log(
                    "11-- Image uploaded to Cloudinary:",
                    uploadedImageUrl
                  );

                  const news = new News({
                    title,
                    category,
                    status,
                    publish_date,
                    source_type,
                    image_url: uploadedImageUrl, // Cloudinary image URL save karein
                  });

                  await news.save();
                  console.log("12-- News created successfully");
                  return res.status(200).json({
                    success: true,
                    message: "News created successfully",
                  });
                }
              );

              uploadResult.end(req.file.buffer); // Image buffer Cloudinary par bhej raha hai
            } catch (cloudinaryError) {
              console.log(
                "13-- Cloudinary upload exception:",
                cloudinaryError.message
              );
              return res.status(500).json({
                success: false,
                message: "Image upload to Cloudinary failed",
              });
            }
          } else if (image_url) {
            console.log("14-- Saving news with provided image URL:", image_url);

            const news = new News({
              title,
              category,
              status,
              publish_date,
              source_type,
              image_url,
            });

            await news.save();
            console.log("15-- News created successfully with image URL");
            return res.status(200).json({
              success: true,
              message: "News created successfully",
            });
          } else {
            console.log("16-- Error: No image provided");
            return res.status(400).json({
              success: false,
              message: "Please provide a news image",
            });
          }
        } else {
          console.log("17-- Error: Invalid source type");
          return res.status(400).json({
            success: false,
            message: "Source type required",
          });
        }
      } catch (error) {
        console.log("18-- Error occurred:", error.message);
        return res.status(400).json({
          success: false,
          message: `${error?.message}`,
        });
      }
    } else {
      console.log("19-- Error: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Something went wrong, missing required fields",
      });
    }
  }
);

export default newsRoute;
