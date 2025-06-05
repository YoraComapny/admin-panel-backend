import AdsType from "./addsModel.js";

// Create Ads Type
export const createAdsType = async (req, res) => {
  try {
    const { name, status } = req.body;
    console.log(name, status);

    // Check if name already exists
    const existingAdsType = await AdsType.findOne({ name });
    if (existingAdsType) {
      return res.status(400).json({ message: "Ads type already exists" });
    }

    const newAdsType = new AdsType({ name, status });
    await newAdsType.save();

    res
      .status(201)
      .json({ message: "Ads type created successfully", newAdsType });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Ads Types

export const getAdsTypes = async (req, res) => {
  try {
    const adsTypes = await AdsType.find();
    res.status(200).json(adsTypes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete All Ads Types
export const deleteAdsType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAds = await AdsType.findByIdAndDelete(id);

    if (!deletedAds) {
      return res.status(404).json({ message: "Ads type not found" });
    }

    res.status(200).json({ message: "Ads type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Ads Type by ID
export const updateAdsType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    // Find the existing AdsType
    const adsType = await AdsType.findById(id);
    if (!adsType) {
      return res.status(404).json({ message: "Ads type not found" });
    }

    // Check if the name is already taken by another record
    const existingAdsType = await AdsType.findOne({ name });
    if (existingAdsType && existingAdsType._id.toString() !== id) {
      return res.status(400).json({ message: "Ads type name already exists" });
    }

    // Update the ads type
    adsType.name = name || adsType.name;
    adsType.status = status !== undefined ? status : adsType.status;

    const updatedAdsType = await adsType.save();
    res
      .status(200)
      .json({ message: "Ads type updated successfully", updatedAdsType });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
