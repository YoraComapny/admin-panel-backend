import androidAds from "./androidAdModel.js";

// Android ads settings create ya update karne ka function
export const createAndUpdateAndroidAd = async (req, res) => {
  try {
    const { androidAdsList } = req.body;

    // Database mein existing settings fetch karna
    let adSettings = await androidAds.findOne();

    if (!adSettings) {
      // Agar existing settings nahi hain, toh naye settings create karna
      adSettings = new androidAds({ androidAdsList });
    } else {
      // Agar existing settings hain, toh unhe update karna
      if (androidAdsList) {
        adSettings.androidAdsList = androidAdsList;
      }
    }

    // Settings ko save karna
    await adSettings.save();

    res
      .status(200)
      .json({ success: true, message: "Ad settings saved successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving ad settings.",
      error: error.message,
    });
  }
};

// Android ads settings fetch karne ka function
export const getAndroidAds = async (req, res) => {
  try {
    // Database se settings fetch karna
    const adSettings = await androidAds.findOne();

    if (adSettings) {
      res.status(200).json({
        success: true,
        message: "Android ads settings fetched successfully",
        data: adSettings,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Android ads settings found",
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

// Delete ad by ID

export const deleteAndroidAdById = async (req, res) => {
  try {
    const { id } = req.params; // URL se ad ID extract karna

    // Sirf specific ad ko array se remove karna, pura document delete nahi karna
    const updatedAds = await androidAds.findOneAndUpdate(
      {}, // Main document ko find karna
      { $pull: { androidAdsList: { _id: id } } }, // Specific ad ko array se remove karna
      { new: true } // Updated document return karna
    );

    if (updatedAds) {
      res.status(200).json({
        success: true,
        message: "Ad deleted successfully",
        data: updatedAds,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Ad not found",
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
