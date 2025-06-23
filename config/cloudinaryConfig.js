import cloudinary from "cloudinary"; // Cloudinary ko default import karo
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export Cloudinary Instance
export default cloudinary.v2;
