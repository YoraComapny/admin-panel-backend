import UploadStatus from "../status/status.model.js";
import Status_images from "./status_update.model.js";

export const CreateOrUpdateImageStatus = async (req, res) => {
  const { status } = req.body;
  console.log("Received status:", status);
  try {
    let view = await Status_images.findOne();

    if (!view) {
      view = new Status_images({ status });
      await view.save();
    } else {
      view.status = status;
      await view.save();
    }
    res.status(200).json({
      success: true,
      message: "status updated successfully",
      status,
    });
  } catch (err) {
    console.error("Error creating or updating status :", err);
    res.status(500).json({ success: false, err: "Server error" });
  }
};

// export const getImageStatus = async (req, res) => {
//   try {
//     const images = await UploadStatus.findOne({});
//     if (!images) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No images found" });
//     }

//     const view = await Status_images.findOne();
//     if (!view) {
//       return res
//         .status(404)
//         .json({ success: false, message: "status_images not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "images-status retrieved successfully",
//       status: view.status,
//       images,
//     });
//   } catch (err) {
//     console.error("Error retrieving status_images:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const getImageStatus = async (req, res) => {
  try {
    const images = await UploadStatus.findOne({});
    if (!images) {
      return res
        .status(404)
        .json({ success: false, message: "No images found" });
    }

    const view = await Status_images.findOne();
    if (!view) {
      return res
        .status(404)
        .json({ success: false, message: "status_images not found" });
    }

    // Remove _id and __v
    const { _id, __v, ...filteredImages } = images.toObject();

    res.status(200).json({
      success: true,
      message: "images-status retrieved successfully",
      status: view.status,
      images: filteredImages,
    });
  } catch (err) {
    console.error("Error retrieving status_images:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
