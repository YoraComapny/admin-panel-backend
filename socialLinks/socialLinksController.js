import SocialLinks from "./socialLinksModel.js";

export const createAndUpdateSocialLinks = async (req, res) => {
  try {
    // Request body se social links ka data extract karna
    const { facebook, instagram, twitter, telegram, youtube } = req.body;

    // Database se existing social links fetch karna
    const socialLinks = await SocialLinks.findOne();

    // Agar existing social links database mein mojood hain
    if (socialLinks) {
      // Agar koi naya data update karne ke liye hai
      if (facebook || instagram || twitter || telegram || youtube) {
        // Existing social links ko update karna
        socialLinks.facebook = facebook || socialLinks.facebook;
        socialLinks.instagram = instagram || socialLinks.instagram;
        socialLinks.twitter = twitter || socialLinks.twitter;
        socialLinks.telegram = telegram || socialLinks.telegram;
        socialLinks.youtube = youtube || socialLinks.youtube;

        // Updated social links ko database mein save karna
        const updatedLinks = await socialLinks.save();
        return res.status(200).json({
          success: true,
          message: "Social links updated successfully",
          data: updatedLinks,
        }); // Success response bhejna
      }

      // Agar koi naya data update karne ke liye nahi hai
      return res
        .status(400)
        .json({ success: false, message: "No new data to update" }); // Error response bhejna
    }

    // Agar existing social links database mein nahi hain,
    // toh naye social links create karna
    const newSocialLinks = new SocialLinks({
      facebook,
      instagram,
      twitter,
      telegram,
      youtube,
    });

    // Naye social links ko database mein save karna
    const savedLinks = await newSocialLinks.save();
    return res.status(200).json({
      success: true,
      message: "Social links created successfully",
      data: savedLinks,
    }); // Success response bhejna
  } catch (error) {
    // Agar koi error aaye, toh use log karna aur error response bhejna
    console.error("Error updating social links:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSocialLinks = async (req, res) => {
  try {
    // Database se social links fetch karna
    const socialLinks = await SocialLinks.findOne();

    // Agar social links mojood hain
    if (socialLinks) {
      res.status(200).json({
        message: "Data retrieved successfully",
        socialLinks: socialLinks, // Pure social links object ko return karna
      });
    } else {
      // Agar social links nahi milen
      res.status(400).json({ message: "Couldn't find existing social links" });
    }
  } catch (err) {
    // Agar koi error aaye
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err?.message,
    });
  }
};
