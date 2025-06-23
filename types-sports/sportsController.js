import SportsType from "./sportsModel.js";

export const createSports = async (req, res) => {
  try {
    // Corrected variable name "staus" to "status"
    const { name, skq, status } = req.body;

    console.log(name, skq, status); // Debugging log

    // Added "return" to prevent further execution after response
    if (!name || !skq) {
      return res.status(400).json({
        message: "Please provide name or skq fields",
      });
    }

    const existingsportsType = await SportsType.findOne({ name });
    if (existingsportsType) {
      return res.status(400).json({
        message: "Sports type already exists",
      });
    }

    // Create a new sports type document
    const newSports = new SportsType({
      name,
      skq,
      status, // Fixed variable name
    });

    // Save to database
    const saveSports = await newSports.save();

    // Check if save was successful
    if (saveSports) {
      return res.status(201).json({
        success: true, // Fixed typo "suucess" → "success"
        message: "Sports created successfully",
        data: saveSports,
      });
    }

    // Error response if saving failed
    return res.status(500).json({
      success: false,
      message: "Failed to create sports",
    });
  } catch (error) {
    // Catch and return any unexpected errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred",
      error: error.message,
    });
  }
};
export const getSports = async (req, res) => {
  try {
    const findsports = await SportsType.find();
    res.status(200).json({
      success: true,
      data: findsports,
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// 🟢 Update Sports Function
export const updateSports = async (req, res) => {
  try {
    const { id } = req.params; // URL se id extract kar rahe hain
    const { name, skq, status } = req.body; // Request body se data le rahe hain

    // 📝 Pehle check kar rahe hain ke record exist karta hai ya nahi
    const sports = await SportsType.findById(id);
    if (!sports) {
      return res.status(404).json({ message: "Sports type not found" });
    }

    // 📝 Agar name kisi aur existing record me hai to error return karo
    const existingSports = await SportsType.findOne({ name });
    if (existingSports && existingSports._id.toString() !== id) {
      return res
        .status(400)
        .json({ message: "Sports type name already exists" });
    }

    // 📝 Jo naya data aaya hai usko update kar rahe hain
    sports.name = name || sports.name;
    sports.skq = skq || sports.skq;
    sports.status = status !== undefined ? status : sports.status;

    // 📝 Database me update save kar rahe hain
    const updatedSports = await sports.save();

    // ✅ Response bhej rahe hain
    res
      .status(200)
      .json({ message: "Sports type updated successfully", updatedSports });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔴 Delete Sports Function
export const deleteSports = async (req, res) => {
  try {
    const { id } = req.params; // URL se id extract kar rahe hain

    // 📝 Pehle check kar rahe hain ke record exist karta hai ya nahi
    const sports = await SportsType.findById(id);
    if (!sports) {
      return res.status(404).json({ message: "Sports type not found" });
    }

    // 📝 Record delete kar rahe hain
    await SportsType.findByIdAndDelete(id);

    // ✅ Response bhej rahe hain
    res.status(200).json({ message: "Sports type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
