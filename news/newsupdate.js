import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import News from "./newsModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
const newsUpdateRoute = express.Router();
import cloudinary from "../config/cloudinaryConfig.js"; // Adjust the path accordingly

// OPTION 1: Use memoryStorage to keep files in memory (RECOMMENDED)
const storage = multer.memoryStorage();

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
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
});

newsUpdateRoute.put(
  "/news/:id",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    console.log("2-- News ID to update:", req.params.id);
    console.log("3-- Received File:", req.file);
    console.log("4-- Received Body:", req.body);

    const newsId = req.params.id;

    // Validate if news ID is provided
    if (!newsId) {
      console.log("5-- Error: News ID is required");
      return res.status(400).json({
        success: false,
        message: "News ID is required",
      });
    }

    let { title, category, image_url, publish_date, status, source_type } =
      req.body;

    console.log("6-- Raw Request body:", req.body);
    console.log("7-- Uploaded file:", req.file);

    // Removing unwanted whitespace and special characters
    title = title?.trim();
    category = category?.trim();
    image_url = image_url?.trim();
    publish_date = publish_date?.trim();
    status = status?.trim();

    console.log("8-- Cleaned Data:", {
      title,
      category,
      image_url,
      publish_date,
      status,
      source_type,
    });

    if (title && category && publish_date && status && source_type) {
      try {
        console.log("9-- Valid request data received");

        // Check if news exists
        const existingNews = await News.findById(newsId);
        if (!existingNews) {
          console.log("10-- Error: News not found");
          return res.status(404).json({
            success: false,
            message: "News not found",
          });
        }

        console.log("11-- Existing news found:", existingNews.title);

        if (typeof source_type === "string") {
          try {
            source_type = JSON.parse(source_type);
          } catch (error) {
            console.log("12-- Error parsing source_type:", error.message);
            return res.status(400).json({
              success: false,
              message: "Invalid source_type format",
            });
          }
        }

        console.log("13-- Parsed source_type:", source_type);

        if (source_type?.own || source_type?.other) {
          console.log("14-- Source type is valid:", source_type);

          let uploadedImageUrl = image_url || existingNews.image_url;

          // Handle file upload
          if (req.file) {
            console.log("15-- Uploading new image to Cloudinary...");

            try {
              // OPTION 1: Using memoryStorage (file.buffer is available)
              const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  { folder: "news_images" },
                  (error, result) => {
                    if (error) {
                      console.log(
                        "16-- Cloudinary Upload Error:",
                        error.message
                      );
                      reject(error);
                    } else {
                      console.log(
                        "17-- New image uploaded to Cloudinary:",
                        result.secure_url
                      );
                      resolve(result);
                    }
                  }
                );
                uploadStream.end(req.file.buffer);
              });

              uploadedImageUrl = uploadResult.secure_url;

              // OPTION 2: If using diskStorage, uncomment below and comment above:
              // const uploadResult = await cloudinary.uploader.upload(req.file.path, {
              //   folder: "news_images"
              // });
              // uploadedImageUrl = uploadResult.secure_url;
              //
              // // Clean up the temporary file
              // fs.unlinkSync(req.file.path);

              // Update news with new image
              const updatedNews = await News.findByIdAndUpdate(
                newsId,
                {
                  title,
                  category,
                  status,
                  publish_date,
                  source_type,
                  image_url: uploadedImageUrl,
                },
                { new: true, runValidators: true }
              );

              console.log("18-- News updated successfully with new image");
              return res.status(200).json({
                success: true,
                message: "News updated successfully",
                news: updatedNews,
              });
            } catch (cloudinaryError) {
              console.log(
                "19-- Cloudinary upload exception:",
                cloudinaryError.message
              );
              return res.status(500).json({
                success: false,
                message: "Image upload to Cloudinary failed",
              });
            }
          } else {
            // No new file uploaded, update with existing data
            console.log("20-- Updating news without new image");

            if (image_url && image_url !== existingNews.image_url) {
              console.log("21-- Using new image URL:", image_url);
              uploadedImageUrl = image_url;
            } else {
              console.log(
                "22-- Keeping existing image:",
                existingNews.image_url
              );
              uploadedImageUrl = existingNews.image_url;
            }

            const updatedNews = await News.findByIdAndUpdate(
              newsId,
              {
                title,
                category,
                status,
                publish_date,
                source_type,
                image_url: uploadedImageUrl,
              },
              { new: true, runValidators: true }
            );

            console.log("23-- News updated successfully");
            return res.status(200).json({
              success: true,
              message: "News updated successfully",
              news: updatedNews,
            });
          }
        } else {
          console.log("24-- Error: Invalid source type");
          return res.status(400).json({
            success: false,
            message: "Source type required",
          });
        }
      } catch (error) {
        console.log("25-- Error occurred:", error.message);

        if (error.name === "CastError") {
          return res.status(400).json({
            success: false,
            message: "Invalid news ID format",
          });
        }

        return res.status(400).json({
          success: false,
          message: `${error?.message}`,
        });
      }
    } else {
      console.log("26-- Error: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Something went wrong, missing required fields",
      });
    }
  }
);

export default newsUpdateRoute;

const removeImage = (file) => {
  fs.unlink("./newsuploads/" + file, function (err) {
    if (err && err.code == "ENOENT") {
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};
