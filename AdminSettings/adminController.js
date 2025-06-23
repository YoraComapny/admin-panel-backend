import AdminSettings from "./adminModel.js";

// Create and Update Setting function
const createAdminSettings = async (req, res) => {
  try {
    const {
      company_name,
      site_title,
      time_zone,
      language,
      app_logo_url,
      app_icon_url,
      facebook,
      twitter,
      instagram,
      android_app_link,
      ios_app_link,
      privacy_policy,
      terms_conditions,
      phone,
      email,
    } = req.body;

    // Get existing admin settings if any
    const adminSettings = await AdminSettings.findOne();

    // If previous settings exist, update them
    if (adminSettings) {
      try {
        // Check if values exist
        if (
          company_name ||
          site_title ||
          time_zone ||
          language ||
          app_logo_url ||
          app_icon_url ||
          facebook ||
          twitter ||
          instagram ||
          android_app_link ||
          ios_app_link ||
          privacy_policy ||
          terms_conditions ||
          phone ||
          email
        ) {
          // update general settings
          adminSettings.general_settings = {
            company_name:
              company_name || adminSettings.general_settings.company_name,
            site_title: site_title || adminSettings.general_settings.site_title,
            time_zone: time_zone || adminSettings.general_settings.time_zone,
            language: language || adminSettings.general_settings.language,
            app_logo_url:
              app_logo_url || adminSettings.general_settings.app_logo_url,
            app_icon_url:
              app_icon_url || adminSettings.general_settings.app_icon_url,
          };
          // update social settings
          adminSettings.social_settings = {
            facebook: facebook || adminSettings.social_settings.facebook,
            twitter: twitter || adminSettings.social_settings.twitter,
            instagram: instagram || adminSettings.social_settings.instagram,
            android_app_link:
              android_app_link ||
              adminSettings.social_settings.android_app_link,
            ios_app_link:
              ios_app_link || adminSettings.social_settings.ios_app_link,
          };
          // update privacy policy and terms and conditions
          adminSettings.privacy_policy =
            privacy_policy || adminSettings.privacy_policy;
          adminSettings.terms_conditions =
            terms_conditions || adminSettings.terms_conditions;
          // update contact info
          adminSettings.contact_info = {
            phone: phone || adminSettings.contact_info.phone,
            email: email || adminSettings.contact_info.email,
          };

          // Save the updated settings
          const updated = await adminSettings.save();
          res.status(200).json({
            message: "Admin Setting updated successfully.",
            settings: updated,
          });
        } else {
          res.status(500).json({
            message: "Nothing to update, enter / change some values",
          });
        }
      } catch (err) {
        res.status(500).json({
          message: `Couldn't update admin settings`,
          error: err.message,
        });
      }
    }
    // If prev settings don't exist, create them
    else if (!adminSettings) {
      try {
        // general settings
        const generalSettings = {
          company_name: company_name,
          site_title: site_title,
          time_zone: time_zone,
          language: language,
          app_logo_url: app_logo_url,
          app_icon_url: app_icon_url,
        };
        // social and app links
        const socialSettings = {
          facebook: facebook,
          twitter: twitter,
          instagram: instagram,
          android_app_link: android_app_link,
          ios_app_link: ios_app_link,
        };
        // Contact info
        const contactInfo = {
          phone: phone,
          email: email,
        };

        // Create new settings, and save them
        const settings = new AdminSettings({
          general_settings: generalSettings,
          social_settings: socialSettings,
          privacy_policy: privacy_policy,
          terms_conditions: terms_conditions,
          contact_info: contactInfo,
        });

        const save = await settings.save();

        // Return response
        res.status(200).json({
          message: "Admin Settings successfully created.",
          settings: save,
        });
      } catch (err) {
        res.status(500).json({
          message: `Couldn't create admin settings`,
          error: err.message,
        });
      }
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get settings function
const getAdminSettings = async (req, res) => {
  try {
    const adminSettings = await AdminSettings.findOne();

    if (adminSettings) {
      res.status(200).json({
        success: true,
        admin_settings: adminSettings,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Couldn't find admin settings...",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

const getPrivacyAndTerms = async (req, res) => {
  try {
    const adminSettings = await AdminSettings.findOne();

    if (adminSettings) {
      res.status(200).json({
        success: true,
        privacy_policy: adminSettings.privacy_policy,
        terms_conditions: adminSettings.terms_conditions,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Couldn't find admin settings...",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export { createAdminSettings, getAdminSettings, getPrivacyAndTerms };
