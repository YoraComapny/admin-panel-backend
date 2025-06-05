import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import News from "./newsModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
const newsUpdateRoute = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "newsuploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|jfif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Your allowed to uopload images only", false);
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 2MB
  },
});

newsUpdateRoute.put(
  "/news/:id",
  upload.single("filename"),
  authMiddleware,
  async (req, res) => {
    const { title, category, image_url, publish_date, status, source_type } =
      req.body;
    const { id } = req.params;
    const filename = req?.file?.filename;
    const singleNews = await News.findById(id);
    if (singleNews) {
      if (
        title ||
        category ||
        publish_date ||
        status ||
        source_type ||
        filename ||
        image_url
      ) {
        try {
          if (singleNews?.image?.length && filename?.length) {
            removeImage(singleNews?.image);
          }

          singleNews.title = title || singleNews.title;
          singleNews.category = category || singleNews.category;
          singleNews.publish_date = publish_date || singleNews.publish_date;
          singleNews.status = status || singleNews.status;
          if (source_type.own) {
            singleNews.source_type.own = {
              my_article:
                source_type.own.my_article ||
                singleNews?.source_type.own.my_article,
            };
          }
          if (source_type.other) {
            singleNews.source_type.other = {
              source_name:
                source_type.other.source_name ||
                singleNews?.source_type.other.source_name,
              source_url:
                source_type.other.source_url ||
                singleNews?.source_type.other.source_url,
            };
          }
          singleNews.source_type = source_type || singleNews.source_type;
          singleNews.image = filename ?? singleNews.image;
          singleNews.image_url = image_url || singleNews.image_url;

          const saveNews = await singleNews.save();
          res.status(200).json({
            success: true,
            message: "success",
            saveNews,
          });
        } catch (error) {
          console.log(error, "error");
          res.status(400).json({
            success: false,
            message: `${error?.message}`,
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "something wents wrong",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "News not found",
      });
    }
  }
);

export default newsUpdateRoute;

const removeImage = (file) => {
  fs.unlink("./newsuploads/" + file, function (err) {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};
