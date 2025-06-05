import SelectedLeague from "../Leagues_Fixtures/leagueModel.js";
import League from "./selectedLeagueModel.js";
import UserLeague from "./userLeagueModel.js";
import mongoose from "mongoose";

// Get all available leagues
export const getAllLeagues = async (req, res) => {
  try {
    const leagues = await League.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: leagues,
      message: "Leagues fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching leagues:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch leagues" });
  }
};

export const getSelectedLeagues = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated

    const userLeagues = await UserLeague.find({ user: userId }).sort({
      order: 1,
    });

    console.log("userLeagues.......", userLeagues);

    if (!userLeagues.length) {
      return res.status(200).json({
        success: false,
        message: "No leagues found for this user",
      });
    }

    const formattedLeagues = userLeagues.map((item) => ({
      leagueId: item.league,
      name: item.name, // Use the denormalized name stored in UserLeague
      image_path: item.image_path, // Use the denormalized image_path stored in UserLeague
      order: item.order,
      mongoId: item._id.toString(), // MongoDB ki ID
      unique_id: item.unique_id,
    }));

    // Send response
    return res.status(200).json({
      success: true,
      data: formattedLeagues,
      message: "User leagues fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user leagues:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user leagues",
      error: error.message, // Add the specific error message
    });
  }
};

export const getSelectedLeaguesForApp = async (req, res) => {
  try {
    const userLeagues = await UserLeague.find().sort({
      order: 1,
    });

    if (!userLeagues.length) {
      return res.status(200).json({
        success: false,
        message: "No leagues found for this user",
      });
    }

    const formattedLeagues = userLeagues.map((item) => ({
      leagueId: item.league,
      name: item.name, // Use the denormalized name stored in UserLeague
      image_path: item.image_path, // Use the denormalized image_path stored in UserLeague
      order: item.order,
      mongoId: item._id.toString(), // MongoDB ki ID
      unique_id: item.unique_id,
    }));

    // Send response
    return res.status(200).json({
      success: true,
      data: formattedLeagues,
      message: "User leagues fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user leagues:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user leagues",
      error: error.message, // Add the specific error message
    });
  }
};

export const addLeague = async (req, res) => {
  try {
    const { league_id, name } = req.body;
    const userId = req.user.id;

    // Check if the league exists by ID or name
    const leagueExists = league_id
      ? await SelectedLeague.findById(league_id)
      : await SelectedLeague.findOne({ name });

    console.log("2--League Found in DB:", leagueExists);

    if (!leagueExists) {
      return res.status(404).json({
        success: false,
        message: "League not found",
      });
    }

    // Check if the league is already added for this user
    const existingUserLeague = await UserLeague.findOne({
      user: userId,
      league: leagueExists._id,
    });

    if (existingUserLeague) {
      return res.status(400).json({
        success: false,
        message: "League already added to your selection",
      });
    }

    // Find the highest order number for the user
    const highestOrder = await UserLeague.findOne({ user: userId })
      .sort({ order: -1 })
      .select("order");

    const newOrder = highestOrder ? highestOrder.order + 1 : 0;

    // console.log("New Order Value:", newOrder);

    const newUserLeague = new UserLeague({
      user: userId,
      league: leagueExists._id,
      name: leagueExists.name,
      leagueName: leagueExists.name,
      image_path: leagueExists.image_path,
      unique_id: leagueExists.id,
      order: newOrder,
    });

    await newUserLeague.save();

    // console.log("4--UserLeague Entry Created:", newUserLeague);

    return res.status(200).json({
      success: true,
      data: {
        _id: leagueExists._id.toString(), // MongoDB ID ensure as a string
        name: leagueExists.name,
        image_path: leagueExists.image_path,
        unique_id: leagueExists.id,
        order: newOrder,
      },

      message: "League added successfully",
    });
  } catch (error) {
    console.error("A--Error adding league:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add league",
      error: error.message,
    });
  }
};

// Remove league from user's selection
// export const removeLeague = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const userId = req.user.id;

//     const deletedLeague = await UserLeague.findOneAndDelete({
//       user: userId,
//       league: name,
//     });

//     if (!deletedLeague) {
//       return res.status(404).json({
//         success: false,
//         message: "League not found in your selection",
//       });
//     }

//     await UserLeague.updateMany(
//       { user: userId, order: { $gt: deletedLeague.order } },
//       { $inc: { order: -1 } }
//     );

//     return res.status(200).json({
//       success: true,
//       data: { id: name },
//       message: "League removed successfully",
//     });
//   } catch (error) {
//     console.error("Error removing league:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to remove league" });
//   }
// };

// export const removeLeague = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log("Step 1: Extracted Parameters - User ID:", userId, "_id:", id);

//     // Find and delete the user's selected league
//     const deletedLeague = await UserLeague.findByIdAndDelete(id);

//     if (!deletedLeague) {
//       console.log("Step 2: League not found in user selection");
//       return res.status(404).json({
//         success: false,
//         message: "League not found in your selection",
//       });
//     }

//     console.log("Step 3: Deleted League:", deletedLeague);

//     // Update the order of remaining leagues
//     const updateResult = await UserLeague.updateMany(
//       { user: userId, order: { $gt: deletedLeague.order } },
//       { $inc: { order: -1 } }
//     );

//     console.log(
//       "Step 4: Updated order of leagues. Update result:",
//       updateResult
//     );

//     return res.status(200).json({
//       success: true,
//       data: { id: name },
//       message: "League removed successfully",
//     });
//   } catch (error) {
//     console.error("Error removing league:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to remove league",
//     });
//   }
// };

export const removeLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Ensure user ID is correctly fetched from auth middleware

    console.log("Step 1: Extracted Parameters - User ID:", userId, "_id:", id);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid league ID format",
      });
    }

    // Find and delete the user's selected league
    const deletedLeague = await UserLeague.findByIdAndDelete(id);

    console.log("IIDD", id);

    if (!deletedLeague) {
      console.log("Step 2: League not found in user selection");
      return res.status(404).json({
        success: false,
        message: "League not found in your selection",
      });
    }

    console.log("Step 3: Deleted League:", deletedLeague);

    // Update the order of remaining leagues for the user
    const updateResult = await UserLeague.updateMany(
      { user: userId, order: { $gt: deletedLeague.order } },
      { $inc: { order: -1 } }
    );

    console.log(
      "Step 4: Updated order of leagues. Update result:",
      updateResult
    );

    return res.status(200).json({
      success: true,
      data: { id },
      message: "League removed successfully",
    });
  } catch (error) {
    console.error("Error removing league:", error);
    return res.status(500).json({
      success: false,
      // message: "Failed to remove league",
      // error: error.message, // Send error message for debugging
    });
  }
};

// Update leagues order
export const updateLeaguesOrder = async (req, res) => {
  try {
    const { leagues } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(leagues)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid leagues data" });
    }

    const updatePromises = leagues.map((item) =>
      UserLeague.findOneAndUpdate(
        { user: userId, league: item.id },
        { order: item.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    return res
      .status(200)
      .json({ success: true, message: "Leagues order updated successfully" });
  } catch (error) {
    console.error("Error updating leagues order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update leagues order" });
  }
};
