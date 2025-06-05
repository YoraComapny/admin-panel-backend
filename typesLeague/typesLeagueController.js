import cloudinary from "../config/cloudinaryConfig.js"; // Adjust the path accordingly

import typesLeague from "./typesLeagueModel.js";

export const createTypesLeague = async (req, res) => {
  try {
    console.log("1- Incoming Request Body:", req.body);
    console.log("2- Uploaded File:", req.file);

    const { name, status } = req.body;

    if (!name) {
      console.log("3- Error: Name is required");
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    let leagueData = { name, status: status || "active" };
    console.log("4- Initial League Data:", leagueData);

    // Upload file to Cloudinary if exists
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "typesLeagues" }, // Folder name on Cloudinary
            (error, result) => {
              if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(req.file.buffer);
        });

        leagueData.image = uploadResult.secure_url; // Store the Cloudinary image URL
        console.log("5- Cloudinary File Uploaded:", leagueData.image);
      } catch (error) {
        console.error("6- Error Uploading Image:", error.message);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    console.log("7- Final League Data Before Save:", leagueData);

    // Save to MongoDB
    const league = await typesLeague.create(leagueData);
    console.log("8- League Created Successfully:", league);

    res.status(201).json({ success: true, data: league });
  } catch (error) {
    console.error("9- Error Creating League:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create league",
      error: error.message,
    });
  }
};

export const getTypesLeagues = async (req, res) => {
  try {
    const getData = await typesLeague.findOne();

    if (!getData) {
      return res.status(404).json({
        success: false,
        message: "No Leagues found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Leagues found",
      data: getData, // Returning the found data
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message, // Returning error details
    });
  }
};

export const updateTypesLeague = async (req, res) => {
  try {
    console.log("1- Incoming Request Body:", req.body);
    console.log("2- Uploaded File:", req.file);

    const { name, status } = req.body;
    const id = req.params.id;

    if (!id) {
      console.log("3- Error: ID is required");
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    let updateData = { name, status };

    // Upload file to Cloudinary if exists
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "typesLeagues" }, // Folder name on Cloudinary
            (error, result) => {
              if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(req.file.buffer);
        });

        updateData.image = uploadResult.secure_url; // Store the Cloudinary image URL
        console.log("4- Cloudinary File Uploaded:", updateData.image);
      } catch (error) {
        console.error("5- Error Uploading Image:", error.message);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    console.log("6- Final Update Data Before Save:", updateData);

    // Update in MongoDB
    const updatedLeague = await typesLeague.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedLeague)
      return res
        .status(404)
        .json({ success: false, message: "League not found" });

    console.log("7- League Updated Successfully:", updatedLeague);

    res.status(200).json({ success: true, data: updatedLeague });
  } catch (error) {
    console.error("8- Error Updating League:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update league",
      error: error.message,
    });
  }
};

export const deleteTypesLeague = async (req, res) => {
  try {
    const league = await typesLeague.findByIdAndDelete(req.params.id);
    if (!league)
      return res
        .status(404)
        .json({ success: false, message: "League not found" });

    res
      .status(200)
      .json({ success: true, message: "League deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete league",
      error: error.message,
    });
  }
};
