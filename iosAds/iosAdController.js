import iosAds from "./iosAdModel.js";

// iOS ads settings create ya update karne ka function
export const createAndUpdateIosAd = async (req, res) => {
  try {
    const { iosAdsList } = req.body;

    // Database mein existing settings fetch karna
    let adSettings = await iosAds.findOne();

    if (!adSettings) {
      // Agar existing settings nahi hain, toh naye settings create karna
      adSettings = new iosAds({ iosAdsList });
    } else {
      // Agar existing settings hain, toh unhe update karna
      if (iosAdsList) {
        adSettings.iosAdsList = iosAdsList;
      }
    }

    // Settings ko save karna
    await adSettings.save();

    res
      .status(200)
      .json({ success: true, message: "iOS ad settings saved successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving iOS ad settings.",
      error: error.message,
    });
  }
};

// iOS ads settings fetch karne ka function
export const getIosAds = async (req, res) => {
  try {
    // Database se settings fetch karna
    const adSettings = await iosAds.findOne();

    if (adSettings) {
      res.status(200).json({
        success: true,
        message: "iOS ads settings fetched successfully",
        data: adSettings,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No iOS ads settings found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete iOS ad by ID
// export const deleteIosAdById = async (req, res) => {
//   try {
//     const { id } = req.params; // URL se ad ID extract karna

//     // Sirf specific ad ko array se remove karna, pura document delete nahi karna
//     const updatedAds = await iosAds.findOneAndUpdate(
//       {}, // Main document ko find karna
//       { $pull: { iosAdsList: { _id: id } } }, // Specific ad ko array se remove karna
//       { new: true } // Updated document return karna
//     );

//     if (updatedAds) {
//       res.status(200).json({
//         success: true,
//         message: "iOS ad deleted successfully",
//         data: updatedAds,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "iOS ad not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const deleteIosAdById = async (req, res) => {
  try {
    const { id } = req.params; // 🔹 URL se ad ID extract karna
    console.log("🔹 Request Received to Delete Ad ID:", id);

    // Ad delete karne se pehle database ka data check karna
    const existingAds = await iosAds.findOne();
    console.log("🔍 Existing iOS Ads:", existingAds);

    // Sirf specific ad ko array se remove karna, pura document delete nahi karna
    const updatedAds = await iosAds.findOneAndUpdate(
      {}, // Main document ko find karna
      { $pull: { iosAdsList: { _id: id } } }, // Specific ad ko array se remove karna
      { new: true } // Updated document return karna
    );

    if (updatedAds) {
      console.log("✅ Ad deleted successfully. Updated Ads List:", updatedAds);
      res.status(200).json({
        success: true,
        message: "iOS ad deleted successfully",
        data: updatedAds,
      });
    } else {
      console.log("❌ Ad not found in the database.");
      res.status(404).json({
        success: false,
        message: "iOS ad not found",
      });
    }
  } catch (error) {
    console.error("❌ Error deleting iOS ad:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
