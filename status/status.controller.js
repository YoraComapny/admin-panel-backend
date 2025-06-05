import path from "path";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";
import UploadStatus from "./status.model.js";

// --- Multer Configuration ---
const storage = multer.memoryStorage(); // Use memoryStorage for buffer upload to Cloudinary

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
}).fields([
  { name: "imageFootBall", maxCount: 1 },
  { name: "imageTeam", maxCount: 1 },
]);

// --- Cloudinary Upload Helper ---
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject("Image upload failed");
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

// --- Updated Function ---
// export const updateimages = async (req, res) => {
//   try {
//     const files = req.files;
//     console.log("data available in req.files:", req.files);

//     if (!files?.imageFootBall || !files?.imageTeam) {
//       return res.status(400).json({ message: "Both images are required." });
//     }

//     const imageFootBallBuffer = files.imageFootBall[0].buffer;
//     const imageTeamBuffer = files.imageTeam[0].buffer;

//     // Upload both images to Cloudinary
//     const imageFootBallUrl = await uploadToCloudinary(
//       imageFootBallBuffer,
//       "status-upload"
//     );
//     const imageTeamUrl = await uploadToCloudinary(
//       imageTeamBuffer,
//       "status-upload"
//     );

//     const imageUrls = {
//       imageFootBall: imageFootBallUrl,
//       imageTeam: imageTeamUrl,
//     };

//     const saveImageUrls = new UploadStatus(imageUrls);

//     const result = await saveImageUrls.save();

//     return res.status(200).json({
//       message: "Images uploaded successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const updateimages = async (req, res) => {
//   try {
//     const files = req.files;
//     console.log("Files received:", files);

//     if (!files?.imageFootBall && !files?.imageTeam) {
//       return res.status(400).json({ message: "Both images are required." });
//     }

//     // Access the first file of each field
//     const imageFootBallBuffer = files.imageFootBall[0].buffer;
//     const imageTeamBuffer = files.imageTeam[0].buffer;

//     // Upload both images to Cloudinary
//     const imageFootBallUrl = await uploadToCloudinary(
//       imageFootBallBuffer,
//       "status-upload"
//     );
//     const imageTeamUrl = await uploadToCloudinary(
//       imageTeamBuffer,
//       "status-upload"
//     );

//     const imageUrls = {
//       imageFootBall: imageFootBallUrl,
//       imageTeam: imageTeamUrl,
//     };

//     // Find and update or create new document
//     const filter = {}; // You might want to add specific filter criteria
//     const update = { $set: imageUrls };
//     const options = { upsert: true, new: true };

//     const result = await UploadStatus.findOneAndUpdate(filter, update, options);

//     return res.status(200).json({
//       message: "Images uploaded successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const updateimages = async (req, res) => {
  try {
    // 2. Check if any files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded",
      });
    }

    // 3. Get existing data from DB
    let existingData = await UploadStatus.findOne({});

    // 4. Initialize update object with existing values
    const updateData = {
      imageFootBall: existingData?.imageFootBall || null,
      imageTeam: existingData?.imageTeam || null,
      updatedAt: new Date(),
    };

    // 5. Handle each possible file upload
    const { imageFootBall, imageTeam } = req.files;

    if (imageFootBall && imageFootBall[0]) {
      const imageFootBallBuffer = imageFootBall[0].buffer;
      updateData.imageFootBall = await uploadToCloudinary(
        imageFootBallBuffer,
        "status-upload"
      );
    }

    if (imageTeam && imageTeam[0]) {
      const imageTeamBuffer = imageTeam[0].buffer;
      updateData.imageTeam = await uploadToCloudinary(
        imageTeamBuffer,
        "status-upload"
      );
    }

    // 6. Validate at least one image was updated
    if (
      updateData.imageFootBall === existingData?.imageFootBall &&
      updateData.imageTeam === existingData?.imageTeam
    ) {
      return res.status(400).json({
        success: false,
        message: "No valid images were provided for update",
      });
    }

    // 7. Update database
    const filter = {};
    const update = { $set: updateData };
    const options = { upsert: true, new: true };

    const result = await UploadStatus.findOneAndUpdate(filter, update, options);

    return res.status(200).json({
      success: true,
      message: "Images updated successfully",
      data: {
        updatedFields: {
          ...(imageFootBall && { imageFootBall: true }),
          ...(imageTeam && { imageTeam: true }),
        },
        result,
      },
    });
  } catch (error) {
    console.error("Error updating images:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUpdateimages = async (req, res) => {
  try {
    const data = await UploadStatus.findOne({});

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No upload status found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Upload status retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error retrieving upload status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
